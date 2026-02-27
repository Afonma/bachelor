import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { QueryPaginationRequest } from '@/shared/dtos'
import { pagination } from '@/shared/utils'

import { CreateTeamRequest, PatchTeamRequest } from './dto'

@Injectable()
export class TeamService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async create(dto: CreateTeamRequest) {
		return await this.prismaService.team.create({
			data: {
				...dto
			}
		})
	}

	public async getAll(query: QueryPaginationRequest) {
		const { prismaQuery, page, limit } = pagination(query, {
			searchFields: ['name']
		})

		const [items, total] = await Promise.all([
			this.prismaService.team.findMany({
				...prismaQuery,
				select: {
					id: true,
					name: true,
					createdAt: true,
					users: {
						select: {
							id: true,
							lastname: true,
							firstname: true,
							phone: true,
							role: true,
							email: true,
							createdAt: true
						}
					}
				}
			}),
			this.prismaService.transport.count({
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
		const team = await this.prismaService.team.findUnique({
			where: { id },
			include: {
				users: {
					select: {
						id: true,
						lastname: true,
						firstname: true,
						phone: true,
						role: true,
						email: true,
						createdAt: true
					}
				}
			}
		})

		if (!team) throw new NotFoundException('Team not found')

		return team
	}

	public async patchTeam(id: string, dto: PatchTeamRequest) {
		const { name } = dto

		return await this.prismaService.team.update({
			where: {
				id
			},
			data: {
				name
			},
			select: {
				id: true,
				name: true
			}
		})
	}

	public async remove(id: string) {
		await this.prismaService.team.delete({
			where: {
				id
			}
		})
	}
}
