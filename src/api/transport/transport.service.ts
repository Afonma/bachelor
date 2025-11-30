import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infra/prisma/prisma.service'

import { CloudinaryService } from '@/libs/cloudinary/cloudinary.service'

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
				...dto
			}
		})
	}

	public async getAll() {
		return await this.prismaService.transport.findMany({
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
		})
	}

	public async getById(id: string) {
		return await this.prismaService.transport.findUnique({
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
