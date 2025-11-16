import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateTeamRequest {
	@ApiProperty({
		example: 'Team1',
		description: 'Teams name',
		required: true
	})
	@IsString({ message: 'Teams name must be string' })
	@IsNotEmpty({ message: 'Teams name is required' })
	name: string

	@ApiProperty({
		example: 3,
		description: 'Workers count',
		required: true
	})
	@IsNumber()
	workersCount: number
}
