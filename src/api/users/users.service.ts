import { Injectable, NotFoundException } from '@nestjs/common'
import { ChatType } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { QueryPaginationRequest } from '@/shared/dtos/query-pagination.dto'
import { pagination } from '@/shared/utils/pagination'

import { CreateUserRequest, PatchUserRequest } from './dto'

@Injectable()
export class UsersService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async create(dto: CreateUserRequest) {
		const hashedPassword = await hash(dto.password)

		const existing = await this.prismaService.user.findUnique({
			where: {
				email: dto.email
			}
		})

		if (existing) throw new NotFoundException('User with this email is already existed')

		const user = await this.prismaService.user.create({
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

		const general = await this.prismaService.chat.findFirst({
			where: { type: ChatType.GENERAL }
		})

		if (general) {
			await this.prismaService.chatMember.create({
				data: {
					chatId: general.id,
					userId: user.id
				}
			})
		}

		await this.prismaService.chat.create({
			data: {
				name: 'Saved Messages',
				type: ChatType.NOTE,
				ownerId: user.id
			}
		})

		return user
	}

	public async getAll(query: QueryPaginationRequest) {
		const { prismaQuery, page, limit } = pagination(query, {
			searchFields: ['email']
		})

		const [items, total] = await Promise.all([
			this.prismaService.user.findMany({
				...prismaQuery,
				select: {
					id: true,
					firstname: true,
					lastname: true,
					email: true,
					phone: true,
					role: true,
					createdAt: true
				}
			}),
			this.prismaService.user.count({
				where: prismaQuery.where
			})
		])

		const totalPages = Math.ceil(total / limit)

		return {
			items,
			meta: {
				total,
				page: Number(query.page) || 1,
				limit: Number(query.limit) || 20,
				totalPages,
				nextPage: page < totalPages ? page + 1 : null,
				prevPage: page > 1 ? page - 1 : null
			}
		}
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

		if (!user) throw new NotFoundException('User not found')

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
				phone,
				team: dto.teamId ? { connect: { id: dto.teamId } } : undefined
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
