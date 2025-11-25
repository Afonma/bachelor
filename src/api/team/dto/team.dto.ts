import { ApiProperty } from '@nestjs/swagger'

export class TeamResponse {
	@ApiProperty({
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f',
		description: 'Unique team ID'
	})
	public id: string

	@ApiProperty({
		example: 'Team1',
		description: 'Team Name'
	})
	public name: string

	@ApiProperty({
		example: '2025-10-28T17:30:00.000Z',
		description: 'Date when the user was created'
	})
	public createdAt: Date

	@ApiProperty({
		example: '2025-10-28T17:30:00.000Z',
		description: 'Date when the user was updated'
	})
	public updatedAt: Date
}
