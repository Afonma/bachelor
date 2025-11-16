import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { CreateTeamRequest } from './dto/create-team.dto'

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
		return this.prismaService.team.findMany()
	}

	public async getById(id: string) {
		return this.prismaService.team.findFirst({
			where: {
				id
			}
		})
	}

	public async patchTeam(id: string, dto: CreateTeamRequest) {
		const { name, workersCount } = dto

		return await this.prismaService.team.update({
			where: {
				id
			},
			data: {
				name,
				workersCount
			},
			select: {
				id: true,
				name: true,
				workersCount: true
			}
		})
	}

	public async removeTeam(id: string) {
		await this.prismaService.team.delete({
			where: {
				id
			}
		})
	}
}
