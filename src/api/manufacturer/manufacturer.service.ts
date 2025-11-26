import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { CreateManufacturerRequest } from './dto/create-manufacturer.dto'
import { PatchManufacturerRequest } from './dto/patch-manufacturer.dto'

@Injectable()
export class ManufacturerService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async createManufacturer(dto: CreateManufacturerRequest) {
		return await this.prismaService.manufacturer.create({
			data: {
				...dto
			}
		})
	}

	public async getAll() {
		return await this.prismaService.manufacturer.findMany()
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
