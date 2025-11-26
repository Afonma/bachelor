import { ApiProperty } from '@nestjs/swagger'
import { TransportResponse } from 'src/api/transport/dto'

export class ManufacturerResponse {
	@ApiProperty({
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f',
		description: 'Manufacturer id'
	})
	public id: string

	@ApiProperty({
		example: '',
		description: 'Manufacturer slug'
	})
	public slug: string

	@ApiProperty({
		example: 'Audi',
		description: 'Manufacturer name'
	})
	public name: string

	@ApiProperty({
		type: TransportResponse,
		description: 'Transport list'
	})
	public transport: TransportResponse[]

	@ApiProperty({
		example: '2025-10-28T17:30:00.000Z',
		description: 'Manufacturer creation date'
	})
	public createdAt: Date

	@ApiProperty({
		example: '2025-10-28T17:30:00.000Z',
		description: 'Manufacturer update date'
	})
	public updatedAt: Date
}
