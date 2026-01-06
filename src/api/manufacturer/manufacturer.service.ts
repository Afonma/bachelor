import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { QueryPaginationRequest } from '@/shared/dtos'
import { pagination, slugify } from '@/shared/utils'

import { CreateManufacturerRequest } from './dto/create-manufacturer.dto'
import { PatchManufacturerRequest } from './dto/patch-manufacturer.dto'

@Injectable()
export class ManufacturerService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async createManufacturer(dto: CreateManufacturerRequest) {
		return await this.prismaService.manufacturer.create({
			data: {
				name: dto.name,
				slug: slugify(dto.name)
			}
		})
	}

	public async getAll(query: QueryPaginationRequest) {
		const { prismaQuery, page, limit } = pagination(query, {
			searchFields: ['name']
		})

		const [items, total] = await Promise.all([
			this.prismaService.manufacturer.findMany({
				...prismaQuery,
				select: {
					id: true,
					name: true,
					createdAt: true
				}
			}),
			this.prismaService.manufacturer.count({
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
		return await this.prismaService.manufacturer.findUnique({
			where: {
				id
			},
			include: {
				transport: {
					select: {
						id: true,
						name: true,
						image: true,
						status: true,
						tasks: true,
						createdAt: true
					}
				}
			}
		})
	}

	public async patchManufacturer(id: string, dto: PatchManufacturerRequest) {
		return await this.prismaService.manufacturer.update({
			where: {
				id
			},
			data: {
				...dto
			},
			select: {
				name: true
			}
		})
	}

	public async removeManufacturer(id: string) {
		return await this.prismaService.manufacturer.delete({
			where: {
				id
			}
		})
	}
}
