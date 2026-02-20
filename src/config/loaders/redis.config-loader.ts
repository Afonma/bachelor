import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

import { AllConfigs } from '../definitions'

export function getRedisConfig(configService: ConfigService<AllConfigs>): Promise<Redis> {
	return Promise.resolve(
		new Redis({
			host: configService.get('redis.host', { infer: true }),
			port: configService.get('redis.port', { infer: true }),
			username: configService.get('redis.username', { infer: true }),
			password: configService.get('redis.password', { infer: true }),
			db: 0
		})
	)
}
