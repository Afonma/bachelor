import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

import { AllConfigs } from '../definitions'

export function getJwtConfig(configService: ConfigService<AllConfigs>): JwtModuleOptions {
	return {
		secret: configService.get('jwt.secret', { infer: true })
	}
}
