import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
	ConnectedSocket,
	MessageBody,
	type OnGatewayConnection,
	type OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException
} from '@nestjs/websockets'
import { ChatType } from '@prisma/client'
import type { Server, Socket } from 'socket.io'

import { PrismaService } from '@/infra/prisma/prisma.service'
import { RedisService } from '@/infra/redis/redis.service'

import { JwtPayload } from '../auth/interfaces'

import { ChatService } from './chat.service'
import { MessageRequest } from './dto'

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	public server: Server

	public constructor(
		private readonly jwtService: JwtService,
		private readonly prismaService: PrismaService,
		private readonly chatService: ChatService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService
	) {}

	public async afterInit(server: Server) {
		server.use(async (client, next) => {
			try {
				const auth = client.handshake.headers.authorization
				if (!auth) return next(new Error('Unauthorized'))

				const token = auth.replace('Bearer', '').trim()
				const payload = this.jwtService.verify<JwtPayload>(token, {
					secret: this.configService.getOrThrow<string>('JWT_SECRET')
				})

				const user = await this.prismaService.user.findUnique({
					where: { id: payload.id },
					select: { id: true }
				})

				if (!user) return next(new Error('Unauthorized'))

				client.data.user = user

				next()
			} catch {
				next(new Error('Unauthorized'))
			}
		})
	}

	public async handleConnection(client: Socket) {
		const user = client.data.user

		if (!user) {
			client.disconnect(true)
			return
		}

		const count = await this.redisService.scard(`user:sockets:${user.id}`)
		await this.redisService.sadd(`user:sockets:${user.id}`, client.id)

		if (count === 0) {
			await this.redisService.sadd('users:online', user.id)
			this.server.emit('user:online', { userId: user.id })
		}

		client.join('general')
	}

	public async handleDisconnect(client: Socket) {
		const user = client.data.user
		if (!user) return

		await this.redisService.srem(`user:sockets:${user.id}`, client.id)

		const isEmpty = await this.redisService.delIfEmpty(`user:sockets:${user.id}`)

		if (isEmpty) {
			await this.redisService.srem('users:online', user.id)
			this.server.emit('user:offline', { userId: user.id })
		}
	}

	@SubscribeMessage('note')
	public async onNote(@ConnectedSocket() client: Socket, @MessageBody() dto: MessageRequest) {
		const user = client.data.user

		const notes = await this.prismaService.chat.findFirst({
			where: {
				type: ChatType.NOTE,
				ownerId: user.id
			}
		})

		if (!notes) throw new WsException('Notes chat not found')

		const message = await this.chatService.sendMessage(
			{
				...dto,
				chatId: notes.id
			},
			user.id
		)

		client.emit('note', message)
	}

	@SubscribeMessage('message')
	public async onMessage(@ConnectedSocket() client: Socket, @MessageBody() dto: MessageRequest) {
		const user = client.data.user

		const general = await this.prismaService.chat.findFirst({
			where: { type: ChatType.GENERAL }
		})

		if (!general) throw new WsException('General chat not found')

		const message = await this.chatService.sendMessage(dto, user.id)
		this.server.to('general').emit('message', message)
	}

	@SubscribeMessage('online:count')
	public async onOnlineCount(@ConnectedSocket() client: Socket) {
		const count = await this.redisService.scard('users:online')
		client.emit('online:count', { count })
	}

	@SubscribeMessage('online:list')
	public async onOnlineList(@ConnectedSocket() client: Socket) {
		const users = await this.redisService.smembers('users:online')
		client.emit('online:list', users)
	}
}
