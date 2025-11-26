import { ApiProperty } from '@nestjs/swagger'

export class TaskResponse {
	@ApiProperty({
		example: 'Task1',
		description: 'Task name'
	})
	public name: string

	@ApiProperty({
		example: 'You need to fix the engine.',
		description: 'Task description'
	})
	public description: string

	@ApiProperty({
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f',
		description: 'Transport id'
	})
	public transportId: string

	@ApiProperty({
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f',
		description: 'Team id'
	})
	public teamId: string

	@ApiProperty({
		example: '2025-03-16T00:00:00.000Z',
		description: 'Task start date'
	})
	public startDate: Date

	@ApiProperty({
		example: '2025-03-16T00:00:00.000Z',
		description: 'Task end date'
	})
	public endDate: Date

	@ApiProperty({
		example: '2025-03-16T00:00:00.000Z',
		description: 'Date when the task was created'
	})
	public createdAt: Date
	@ApiProperty({
		example: '2025-03-16T00:00:00.000Z',
		description: 'Date when the task was created'
	})
	public updatedAt: Date
}
