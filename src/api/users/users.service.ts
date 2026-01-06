import { Injectable, NotFoundException } from '@nestjs/common'
import { hash } from 'argon2'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { CreateUserRequest, PatchUserRequest } from './dto'

@Injectable()
export class UsersService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async create(dto: CreateUserRequest) {
		const hashedPassword = await hash(dto.password)

		const user = await this.prismaService.user.findUnique({
			where: {
				email: dto.email
			}
		})

		if (user) throw new NotFoundException('User with this email is already existed')

		return this.prismaService.user.create({
			data: {
				...dto,
				password: hashedPassword,
				teamId: dto.teamId
			},
			select: {
				id: true,
				lastname: true,
				firstname: true,
				phone: true,
				role: true,
				email: true,
				createdAt: true,
				teamId: true
			}
		})
	}

	public async getById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				lastname: true,
				firstname: true,
				phone: true,
				role: true,
				email: true,
				createdAt: true,
				teamId: true
			}
		})

		if (user) throw new NotFoundException('User with this email is already existed')

		return user
	}
	public async patchUser(id: string, dto: PatchUserRequest) {
		const { firstname, lastname, phone } = dto

		return await this.prismaService.user.update({
			where: {
				id
			},
			data: {
				firstname,
				lastname,
				phone
			},
			select: {
				id: true,
				lastname: true,
				firstname: true,
				phone: true,
				role: true,
				email: true,
				createdAt: true,
				team: true
			}
		})
	}
	public async remove(id: string) {
		await this.prismaService.user.delete({
			where: {
				id
			}
		})
	}
}
