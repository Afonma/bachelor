import { IsString } from 'class-validator'

export class CloudinaryValidator {
	@IsString()
	CLOUDINARY_API_KEY: string

	@IsString()
	CLOUDINARY_API_SECRET: string

	@IsString()
	CLOUDINARY_API_NAME: string
}