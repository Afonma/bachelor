import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { StatisticsResponse } from './dto'
import { StatisticsService } from './statistics.service'

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@ApiOperation({
		summary: 'Get all statistics'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Return the list of statistics',
		type: StatisticsResponse
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid data'
	})
	@HttpCode(HttpStatus.OK)
	@Get()
	public getStatitics() {
		return this.statisticsService.getStatistics()
	}
}
