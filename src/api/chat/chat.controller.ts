import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'

import { PrismaService } from '@/infra/prisma/prisma.service'
import { Authorized, Protected } from '@/shared/decorators'

import { JwtPayload } from '../auth/interfaces'

@Controller('chat')
export class ChatController {
	public constructor(public readonly prismaService: PrismaService) {}

	@Get('/')
	@Protected()
	@HttpCode(HttpStatus.OK)
	public async getNote(@Authorized() user: JwtPayload) {
		return await this.prismaService.chat.findFirst({
			where: { ownerId: user.id }
		})
	}
}
