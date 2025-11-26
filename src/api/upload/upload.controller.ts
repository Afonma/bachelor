import { Controller, HttpCode, HttpStatus, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { ApiFileUpload } from '@/common/decorators'
import { CloudinaryService } from '@/libs/cloudinary/cloudinary.service'

import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
	public constructor(
		private readonly uploadService: UploadService,
		private readonly cloudinaryService: CloudinaryService
	) {}

	@ApiOperation({ summary: 'Upload a file', description: 'Upload a file' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'File successfully upload.'
	})
	@UseInterceptors(FilesInterceptor('files'))
	@ApiFileUpload()
	@Post('/')
	@HttpCode(HttpStatus.CREATED)
	public async upload(@UploadedFiles() files: Express.Multer.File[]) {
		return this.uploadService.uploads(files)
	}

	@ApiOperation({
		summary: 'Destroy a file',
		description: 'Destroy a file'
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'File successfully destroy.'
	})
	@Post('destroy/:public_id')
	@HttpCode(HttpStatus.CREATED)
	public async destroy(@Param('public_id') public_id: string) {
		return await this.cloudinaryService.destroy(public_id)
	}
}
