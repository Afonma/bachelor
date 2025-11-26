import { Injectable } from '@nestjs/common'

import { CloudinaryService } from '@/libs/cloudinary/cloudinary.service'

@Injectable()
export class UploadService {
	public constructor(private readonly cloudinaryService: CloudinaryService) {}

	public async saveFiles(files: Express.Multer.File[]) {
		const res = await Promise.all(
			files.map(async file => {
				const upload = await this.cloudinaryService.upload(file)

				return upload.secure_url
			})
		)

		return res
	}
}
