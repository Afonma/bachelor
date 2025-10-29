import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateUserRequest {
	@ApiProperty({
		example: 'John',
		description: 'User first name'
	})
	@IsString({ message: 'First name must be a string' })
	@IsNotEmpty({ message: 'First name is required' })
	public firstname: string

	@ApiProperty({
		example: 'Doe',
		description: 'User last name (optional)',
		required: false
	})
	@IsOptional()
	@IsString({ message: 'Last name must be a string' })
	public lastname?: string

	@ApiProperty({
		example: 'user@example.com',
		description: 'User email (must be unique)'
	})
	@IsEmail({}, { message: 'Invalid email format' })
	public email: string

	@ApiProperty({
		example: 'password123',
		description: 'User password (minimum 6 characters)'
	})
	@IsString({ message: 'Password must be a string' })
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	public password: string

	@ApiProperty({
		example: '+1234567890',
		description: 'User phone number (optional)',
		required: false
	})
	@IsOptional()
	@IsString({ message: 'Phone number must be a string' })
	public phone?: string

	// @ApiProperty({
	//     example: 'team-uuid-1234',
	//     description: 'ID of the team the user belongs to'
	// })
	// @IsOptional()
	// @IsString({ message: 'Team ID must be a string' })
	// public teamId?: string
}
