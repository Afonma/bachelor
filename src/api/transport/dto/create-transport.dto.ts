import { ApiProperty } from '@nestjs/swagger'
import { TransportStatus } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

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
		example: 'READY',
		description: 'Car status default(READY)',
		enum: TransportStatus
	})
	@IsString({ message: 'Transport status must be string' })
	@IsNotEmpty({ message: 'Transport status is required' })
	status: TransportStatus

	@ApiProperty({
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f',
		description: 'Manufacturer id'
	})
	@IsString({ message: 'Manufacturer id must be string' })
	@IsNotEmpty({ message: 'Manufacturer id is required' })
	manufacturerId: string
}
