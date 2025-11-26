import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateManufacturerRequest {
	@ApiProperty({
		example: '',
		description: 'Slug'
	})
	@IsNotEmpty({
		message: 'Slug is required'
	})
	@IsString({
		message: 'Slug must be string'
	})
	slug: string

	@ApiProperty({
		example: 'Audi',
		description: 'Manufacturer name'
	})
	@IsNotEmpty({
		message: 'Manufacturer name is required'
	})
	@IsString({
		message: 'Manufacturer name must be string'
	})
	name: string
}
