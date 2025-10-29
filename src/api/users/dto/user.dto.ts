import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'

export class UserResponse {
	@ApiProperty({
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f',
		description: 'Unique user ID'
	})
	public id: string

	@ApiProperty({
		example: 'John',
		description: 'User first name'
	})
	public firstname: string

	@ApiProperty({
		example: 'Doe',
		description: 'User last name (optional)',
		required: false
	})
	public lastname?: string

	@ApiProperty({
		example: 'john.doe@example.com',
		description: 'User email address'
	})
	public email: string

	@ApiProperty({
		example: '+1234567890',
		description: 'User phone number (optional)',
		required: false
	})
	public phone?: string

	@ApiProperty({
		example: 'WORKER',
		description: 'User role (default: WORKER)',
		enum: UserRole
	})
	public role: UserRole

	@ApiProperty({
		example: '2025-10-28T17:30:00.000Z',
		description: 'Date when the user was created'
	})
	public createdAt: Date
}
