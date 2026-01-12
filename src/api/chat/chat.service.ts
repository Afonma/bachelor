import { Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { ChatType } from '@prisma/client'
import { Server } from 'socket.io'

import { PrismaService } from '@/infra/prisma/prisma.service'
import { RedisService } from '@/infra/redis/redis.service'

import { MessageRequest } from './dto'

@Injectable()
export class ChatService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService
	) {}

	public async connected(userId: string, socketId: string, server: Server) {
		const count = await this.redisService.scard(`user:sockets:${userId}`)
		await this.redisService.sadd(`user:sockets:${userId}`, socketId)

		if (count === 0) {
			await this.redisService.sadd('users:online', userId)
			server.emit('user:online', { userId })
		}
	}

	public async disconnected(userId: string, socketId: string, server: Server) {
		await this.redisService.srem(`user:sockets:${userId}`, socketId)
		const isEmpty = await this.redisService.delIfEmpty(`user:sockets:${userId}`)

		if (isEmpty) {
			await this.redisService.srem('users:online', userId)
			server.emit('user:offline', { userId })
		}
	}

	public async online() {
		return this.redisService.scard('users:online')
	}

	public async sendMessage(dto: MessageRequest, userId: string) {
		const { content } = dto

		if (!content.trim()) throw new WsException('Empty message')

		return await this.prismaService.message.create({
			data: {
				chatId: dto.chatId,
				content: dto.content,
				senderId: userId
			}
		})
	}

	public async sendMessageByNote(dto: MessageRequest, userId: string) {
		const notes = await this.prismaService.chat.findFirst({
			where: {
				type: ChatType.NOTE,
				ownerId: userId
			}
		})

		if (!notes) throw new WsException('Notes chat not found')

		const message = await this.sendMessage(
			{
				...dto,
				chatId: notes.id
			},
			userId
		)

		return message
	}

	public async sendMessageByGeneral(dto: MessageRequest, userId: string) {
		const general = await this.prismaService.chat.findFirst({
			where: { type: ChatType.GENERAL }
		})

		if (!general) throw new WsException('General chat not found')

		const message = await this.sendMessage(dto, userId)

		return message
	}
}
