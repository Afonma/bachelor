import { ApiProperty } from '@nestjs/swagger'
import { CarStatus } from '@prisma/client'

export class TransportResponse {
	@ApiProperty({
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f',
		description: 'Tranport id'
	})
	public id: string

	@ApiProperty({
		example: 'Tiguan',
		description: 'Transport name'
	})
	public name: string

	@ApiProperty({
		example: 'https://tiguanphoto....',
		description: 'Transport photo'
	})
	public image: string

	@ApiProperty({
		example: 'READY',
		description: 'Transport status default(READY)',
		enum: CarStatus
	})
	public status: CarStatus

	@ApiProperty({
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f',
		description: 'Manufacturer id'
	})
	public manufacturerId: string

	@ApiProperty({
		example: '2025-10-28T17:30:00.000Z',
		description: 'Transport creation time'
	})
	public createdAt: Date

	@ApiProperty({
		example: '2025-10-28T17:30:00.000Z',
		description: 'Transport update time'
	})
	public updatedAt: Date
}
