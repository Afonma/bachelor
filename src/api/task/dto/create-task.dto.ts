import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsString } from 'class-validator'

export class CreateTaskRequest {
	@ApiProperty({
		example: 'Task1',
		required: true,
		description: 'Task name'
	})
	@IsNotEmpty({ message: 'Task name is required' })
	@IsString({ message: 'Name must be string' })
	name: string

	@ApiProperty({
		example: 'You need to fix the engine.',
		required: true,
		description: 'Task description'
	})
	@IsNotEmpty({ message: 'Description is required' })
	@IsString({ message: 'Description must be string' })
	description: string

	@ApiProperty({
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f',
		required: true,
		description: 'Transport id'
	})
	@IsNotEmpty({ message: 'Transport id is required' })
	@IsString({ message: 'Transport id must be string' })
	transportId: string

	@ApiProperty({
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f',
		required: true,
		description: 'Team id'
	})
	@IsNotEmpty({ message: 'Team id is required' })
	@IsString({ message: 'Team id must be string' })
	teamId: string

	@ApiProperty({
		example: '2025-03-16T00:00:00.000Z',
		required: true,
		description: 'Task start date'
	})
	@Type(() => Date)
	@IsNotEmpty({ message: 'Start date is required' })
	@IsDate({ message: 'Start date must have date format' })
	startDate: Date

	@ApiProperty({
		example: '2025-03-16T00:00:00.000Z',
		required: true,
		description: 'Task end date'
	})
	@Type(() => Date)
	@IsNotEmpty({ message: 'End date is required' })
	@IsDate({ message: 'End date must have date format' })
	endDate: Date

	@ApiProperty({
		example: 'WORKER',
		description: 'User role (default: WORKER)',
		enum: UserRole
	})
	@IsString({ message: 'Role must be string' })
	@IsNotEmpty({ message: 'Role is required' })
	public role: UserRole
}
