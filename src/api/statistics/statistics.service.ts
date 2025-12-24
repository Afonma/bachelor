import { Injectable } from '@nestjs/common'
import { TransportStatus, UserRole } from '@prisma/client'

import { PrismaService } from '@/infra/prisma/prisma.service'

@Injectable()
export class StatisticsService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async getStatistics() {
		const [teams, workers, transports] = await Promise.all([
			this.prismaService.team.count(),
			this.prismaService.user.aggregate({
				where: {
					role: UserRole.WORKER
				},
				_count: true
			}),
			this.prismaService.transport.aggregate({
				where: {
					status: TransportStatus.READY
				},
				_count: true
			})
		])
		return { teams, workers: workers._count, transports: transports._count }
	}
}
