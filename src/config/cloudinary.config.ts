import { ConfigService } from '@nestjs/config'
import { type CloudinaryOptions } from 'src/libs/cloudinary/interfaces'

export function getCloudinaryConfig(configService: ConfigService): CloudinaryOptions {
	return {
		cloud_name: configService.getOrThrow<string>('CLOUDINARY_API_NAME'),
		api_key: configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
		api_secret: configService.getOrThrow<string>('CLOUDINARY_API_SECRET')
	}
}
