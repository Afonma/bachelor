import { ApiProperty } from '@nestjs/swagger'

export class StatisticsResponse {
	@ApiProperty({
		description: 'Total number of teams',
		example: 3
	})
	public teams: number

	@ApiProperty({
		description: 'Total number of workers',
		example: 10
	})
	public workers: number

	@ApiProperty({
		description: 'Total number of transports',
		example: 10
	})
	public transports: number
}
