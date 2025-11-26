import { Injectable } from '@nestjs/common'
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service'

@Injectable()
export class UploadService {
	public constructor(private readonly cloudinaryService: CloudinaryService) {}

	public async uploads(files: Express.Multer.File[]) {
		const response = await Promise.all(
			files.map(async file => {
				const upload = await this.cloudinaryService.upload(file)

				return upload.secure_url
			})
		)
		return response
	}
}
