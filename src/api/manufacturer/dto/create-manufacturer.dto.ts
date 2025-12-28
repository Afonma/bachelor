import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateManufacturerRequest {
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
	public name: string
}
