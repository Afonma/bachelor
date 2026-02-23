import type { AppConfig } from './app.config'
import type { CloudinaryConfig } from './cloudinary.config'
import type { JwtConfig } from './jwt.config'
import type { RedisConfig } from './redis.config'

export interface AllConfigs {
	app: AppConfig
	redis: RedisConfig
	jwt: JwtConfig
	cloudinary: CloudinaryConfig
}
