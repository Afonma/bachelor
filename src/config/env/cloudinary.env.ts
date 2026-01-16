import { registerAs } from '@nestjs/config'

import type { CloudinaryConfig } from '../definitions'
import { validateEnv } from '../utils/validate-env'
import { CloudinaryValidator } from '../validators'

export const cloudinaryEnv = registerAs<CloudinaryConfig>('cloudinary', () => {
	validateEnv(process.env, CloudinaryValidator)

	return {
		cloud_name: process.env.CLOUDINARY_API_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	}
})