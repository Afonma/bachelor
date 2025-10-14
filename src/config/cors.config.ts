import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { ConfigService } from '@nestjs/config'

export function getCorsConfig(ConfigService: ConfigService): CorsOptions {
	return {
		origin: ConfigService.getOrThrow<string>('HTTP_CORS'),
		credentials: true
	}
}
