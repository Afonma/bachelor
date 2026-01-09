import { Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'

import { PrismaService } from '@/infra/prisma/prisma.service'

import { MessageRequest } from './dto'

@Injectable()
export class ChatService {
	public constructor(private readonly prismaService: PrismaService) {}

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
}
