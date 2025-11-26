import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { getCloudinaryConfig } from '@/config'
import { CloudinaryModule } from '@/libs/cloudinary/cloudinary.module'

import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

@Module({
	controllers: [UploadController],
	providers: [UploadService],
	imports: [
		CloudinaryModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getCloudinaryConfig,
			inject: [ConfigService]
		})
	]
})
export class UploadModule {}
