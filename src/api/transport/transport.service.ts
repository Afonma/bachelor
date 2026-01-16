import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { CloudinaryService } from '@/libs/cloudinary/cloudinary.service'
import { QueryPaginationRequest } from '@/shared/dtos'
import { pagination } from '@/shared/utils'

import { CreateTransportRequest, PatchTransportRequest } from './dto'

@Injectable()
export class TransportService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly cloudinaryService: CloudinaryService
	) {}

	public async create(dto: CreateTransportRequest) {
		return await this.prismaService.transport.create({
			data: {
				name: dto.name,
				image: dto.image,
				status: dto.status,
				manufacturer: {
					connect: {
						id: dto.manufacturerId
					}
				}
			}
		})
	}

	public async getAll(query: QueryPaginationRequest) {
		const { prismaQuery, page, limit } = pagination(query, {
			searchFields: ['name']
		})

		const [items, total] = await Promise.all([
			this.prismaService.transport.findMany({
				...prismaQuery,
				select: {
					id: true,
					name: true,
					image: true,
					status: true
				},
				include: {
					manufacturer: {
						select: {
							id: true,
							slug: true,
							name: true
						}
					},
					tasks: {
						select: {
							id: true,
							name: true,
							description: true
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
		const transport = await this.prismaService.transport.findUnique({
			where: {
				id
			},
			include: {
				manufacturer: {
					select: {
						id: true,
						slug: true,
						name: true
					}
				}
			}
		})

		if (!transport) throw new NotFoundException('Transport not found')

		return transport
	}

	public async patchTransport(id: string, dto: PatchTransportRequest) {
		return await this.prismaService.transport.update({
			where: {
				id
			},
			data: {
				...dto
			},
			select: {
				name: true,
				image: true,
				status: true,
				manufacturerId: true
			}
		})
	}

	public async remove(id: string) {
		const trans = await this.prismaService.transport.findUnique({
			where: {
				id
			}
		})

		const match = /\/upload\/(?:v\d+\/)?([^/.]+)\.[a-z]+$/i.exec(trans?.image)

		await this.cloudinaryService.destroy(match[1])

		return await this.prismaService.transport.delete({
			where: {
				id
			}
		})
	}
}
