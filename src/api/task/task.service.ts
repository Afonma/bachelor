import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { QueryPaginationRequest } from '@/shared/dtos'
import { pagination } from '@/shared/utils'

import { CreateTaskRequest, PatchTaskRequest } from './dto'

@Injectable()
export class TaskService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async create(dto: CreateTaskRequest) {
		return await this.prismaService.task.create({
			data: {
				...dto
			}
		})
	}

	public async getAll(query: QueryPaginationRequest) {
		const { prismaQuery } = pagination(query)

		return await this.prismaService.task.findMany({
			...prismaQuery,
			include: {
				team: {
					select: {
						id: true,
						name: true,
						users: {
							select: {
								lastname: true,
								firstname: true,
								phone: true,
								role: true,
								email: true,
								createdAt: true
							}
						},
						createdAt: true
					}
				},
				transport: {
					select: {
						id: true,
						name: true,
						image: true,
						status: true,
						manufacturer: {
							select: {
								id: true,
								slug: true,
								name: true,
								createdAt: true
							}
						},
						createdAt: true
					}
				}
			}
		})
	}

	public async getById(id: string) {
		return await this.prismaService.task.findUnique({
			where: {
				id
			},
			include: {
				team: {
					select: {
						id: true,
						name: true,
						users: {
							select: {
								lastname: true,
								firstname: true,
								phone: true,
								role: true,
								email: true,
								createdAt: true
							}
						},
						createdAt: true
					}
				},
				transport: {
					select: {
						id: true,
						name: true,
						image: true,
						status: true,
						manufacturer: {
							select: {
								id: true,
								slug: true,
								name: true,
								createdAt: true
							}
						}
					}
				}
			}
		})
	}

	public async patchTask(id: string, dto: PatchTaskRequest) {
		return await this.prismaService.task.update({
			where: {
				id
			},
			data: {
				...dto
			},
			select: {
				name: true,
				description: true,
				endDate: true,
				teamId: true
			}
		})
	}

	public async remove(id: string) {
		return await this.prismaService.task.delete({
			where: {
				id
			}
		})
	}
}

// ПРОВЕРИТЬ ЧТОБЫ ОНО ПРАВИЛЬНО ОТОБРАЖАЛОСЬ В КОМАНДАХ
