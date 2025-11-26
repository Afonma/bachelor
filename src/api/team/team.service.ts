import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infra/prisma/prisma.service'

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

	public async getAll() {
		return await this.prismaService.team.findMany({
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
	}

	public async getById(id: string) {
		return await this.prismaService.team.findUnique({
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
