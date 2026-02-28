import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ConnectedSocket, MessageBody, type OnGatewayConnection, type OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { ChatType } from '@prisma/client'
import type { Server, Socket } from 'socket.io'

import { PrismaService } from '@/infra/prisma/prisma.service'
import { wsJwtMiddleware } from '@/shared/middlewares'

import { ChatService } from './chat.service'
import { MessageRequest } from './dto'

@WebSocketGateway({
	namespace: 'chat',
	cors: {
		origin: 'http://localhost:14701',
		methods: ['GET', 'POST'],
		credentials: true
	}
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	public server: Server

	public constructor(
		private readonly jwtService: JwtService,
		private readonly prismaService: PrismaService,
		private readonly chatService: ChatService,
		private readonly configService: ConfigService
	) {}

	public async afterInit(server: Server) {
		server.use(wsJwtMiddleware(this.jwtService, this.prismaService, this.configService))
	}

	public async handleConnection(client: Socket) {
		const user = client.data.user
		if (!user) return client.disconnect(true)

		await this.chatService.connected(user.id, client.id, this.server)

		client.join('general')
	}

	public async handleDisconnect(client: Socket) {
		const user = client.data.user
		if (!user) return

		await this.chatService.disconnected(user.id, client.id, this.server)
	}

	@SubscribeMessage('general:history')
	public async getGeneralHistory(@ConnectedSocket() client: Socket) {
		const general = await this.prismaService.chat.findFirst({
			where: { type: ChatType.GENERAL },
			include: {
				messages: {
					orderBy: { createdAt: 'asc' }
				}
			}
		})

		client.emit('general:history', general?.messages ?? [])
	}

	@SubscribeMessage('note:history')
	public async getNoteHistory(@ConnectedSocket() client: Socket) {
		const user = client.data.user

		const general = await this.prismaService.chat.findFirst({
			where: { ownerId: user.id, type: ChatType.NOTE },
			include: {
				messages: {
					orderBy: { createdAt: 'asc' }
				}
			}
		})

		client.emit('note:history', general?.messages ?? [])
	}

	@SubscribeMessage('note')
	public async onNote(@ConnectedSocket() client: Socket, @MessageBody() dto: MessageRequest) {
		const user = client.data.user
		const message = await this.chatService.sendMessageByNote(dto, user.id)

		client.emit('note', message)
	}

	@SubscribeMessage('message')
	public async onMessage(@ConnectedSocket() client: Socket, @MessageBody() dto: MessageRequest) {
		const user = client.data.user
		const message = await this.chatService.sendMessageByGeneral(dto, user.id)

		this.server.to('general').emit('message', message)
	}

	@SubscribeMessage('online:count')
	public async onOnlineCount(@ConnectedSocket() client: Socket) {
		const count = await this.chatService.online()
		client.emit('online:count', { count })
	}
}
