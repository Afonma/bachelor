import { ApiProperty } from '@nestjs/swagger'
import { TransportStatus } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateTransportRequest {
	@ApiProperty({
		example: 'Tiguan 2018',
		description: 'Transport name',
		required: true
	})
	@IsString({
		message: 'Transport name must be string'
	})
	@IsNotEmpty({
		message: 'Transport name is required'
	})
	name: string

	@ApiProperty({
		example: 'https://tiguanphoto....',
		description: 'Transport image',
		required: true
	})
	@IsString({
		message: 'Transport image must be string'
	})
	@IsNotEmpty({
		message: 'Transport image is required'
	})
	image: string

	@ApiProperty({
		example: {},
		description: 'Car status default(READY)',
		enum: TransportStatus
	})
	@IsEnum(
		{},
		{
			message: 'Status must be enum'
		}
	)
	status: TransportStatus

	@ApiProperty({
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f',
		description: 'Manufacturer id'
	})
	manufacturerId: string
}
