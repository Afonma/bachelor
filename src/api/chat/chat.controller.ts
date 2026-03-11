import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ChatType } from '@prisma/client'

import { PrismaService } from '@/infra/prisma/prisma.service'
import { Authorized, Protected } from '@/shared/decorators'

import { JwtPayload } from '../auth/interfaces'

@Controller('chat')
export class ChatController {
	public constructor(public readonly prismaService: PrismaService) {}

	@Get('/note')
	@Protected()
	@HttpCode(HttpStatus.OK)
	public async getNote(@Authorized() user: JwtPayload) {
		return await this.prismaService.chat.findFirst({
			where: { ownerId: user.id }
		})
	}

	@Get('/general')
	@Protected()
	@HttpCode(HttpStatus.OK)
	public async getGeneral() {
		return await this.prismaService.chat.findFirst({
			where: { type: ChatType.GENERAL }
		})
	}
}
