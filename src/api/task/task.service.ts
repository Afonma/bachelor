import { Injectable, NotFoundException } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { QueryPaginationRequest } from '@/shared/dtos'
import { pagination } from '@/shared/utils'

import type { JwtPayload } from '../auth/interfaces'

import { CreateSubTaskRequest, CreateTaskRequest, PatchSubTaskRequest, PatchTaskRequest } from './dto'

@Injectable()
export class TaskService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async createTask(dto: CreateTaskRequest) {
		return await this.prismaService.task.create({
			data: {
				...dto
			}
		})
	}

	public async createSubTask(dto: CreateSubTaskRequest) {
		return await this.prismaService.subTask.create({
			data: {
				name: dto.name,
				description: dto.description,
				task: {
					connect: { id: dto.taskId }
				},
				worker: {
					connect: { id: dto.workerId }
				}
			}
		})
	}

	public async getAll(query: QueryPaginationRequest, user: JwtPayload) {
		const { prismaQuery, page, limit } = pagination(query, {
			searchFields: ['name']
		})

		if (user.role === UserRole.HEADWORKER) {
			prismaQuery.where = {
				...prismaQuery.where,
				team: { users: { some: { id: user.id } } }
			}
		} else if (user.role === UserRole.WORKER) {
			prismaQuery.where = {
				...prismaQuery.where,
				subTasks: { some: { workerId: user.id } }
			}
		}

		const [items, total] = await Promise.all([
			this.prismaService.task.findMany({
				...prismaQuery,
				select: {
					id: true,
					name: true,
					description: true,
					startDate: true,
					endDate: true,
					subTasks: {
						select: {
							id: true,
							name: true,
							description: true,
							worker: {
								select: {
									lastname: true,
									firstname: true,
									phone: true,
									role: true,
									email: true,
									createdAt: true
								}
							}
						}
					},
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
			}),

			user.role === UserRole.HEADWORKER
				? this.prismaService.task.count({ where: prismaQuery.where })
				: this.prismaService.subTask.count({ where: { workerId: user.id } })
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

	public async getById(id: string, user?: JwtPayload) {
		const task = await this.prismaService.task.findUnique({
			where: { id },
			include: {
				team: {
					select: {
						id: true,
						name: true,
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
				},
				subTasks: {
					where: user?.role === UserRole.WORKER ? { workerId: user.id } : undefined,
					select: {
						id: true,
						name: true,
						description: true,
						status: true,
						worker: {
							select: {
								id: true,
								firstname: true,
								lastname: true,
								phone: true,
								role: true,
								email: true
							}
						}
					}
				}
			}
		})

		if (!task) throw new NotFoundException('Task not found')

		if (user?.role === UserRole.WORKER && task.subTasks.length === 0) {
			throw new NotFoundException('You do not have access to this task')
		}

		return task
	}

	public async patchTask(id: string, dto: PatchTaskRequest, user: JwtPayload) {
		const task = await this.prismaService.task.findUnique({
			where: { id },
			include: { team: { select: { users: { select: { id: true } } } } }
		})

		if (!task) throw new NotFoundException('Task not found')

		if (user.role === UserRole.HEADWORKER && !task.team.users.some(u => u.id === user.id)) {
			throw new NotFoundException('You do not have access to this task')
		}

		return this.prismaService.task.update({
			where: { id },
			data: { ...dto },
			select: { name: true, description: true, endDate: true, teamId: true }
		})
	}

	public async patchSubTask(id: string, dto: PatchSubTaskRequest, user: JwtPayload) {
		const subTask = await this.prismaService.subTask.findUnique({
			where: { id },
			include: {
				task: {
					select: {
						id: true,
						team: {
							select: {
								id: true,
								users: {
									select: { id: true }
								}
							}
						}
					}
				},
				worker: {
					select: { id: true }
				}
			}
		})

		if (!subTask) throw new NotFoundException('SubTask not found')

		if (user.role === UserRole.WORKER) {
			throw new NotFoundException('You do not have access to edit this SubTask')
		}

		if (user.role === UserRole.HEADWORKER) {
			const isInTeam = subTask.task.team.users.some(u => u.id === user.id)
			if (!isInTeam) throw new NotFoundException('You do not have access to edit this SubTask')
		}

		const updatedSubTask = await this.prismaService.subTask.update({
			where: { id },
			data: { ...dto },
			select: {
				id: true,
				name: true,
				description: true,
				status: true,
				task: {
					select: { id: true, name: true }
				},
				worker: {
					select: { id: true, firstname: true, lastname: true, email: true }
				}
			}
		})

		return updatedSubTask
	}

	public async remove(id: string) {
		return await this.prismaService.task.delete({
			where: {
				id
			}
		})
	}
}
