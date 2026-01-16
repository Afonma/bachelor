import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ApiModule } from '@/api/api.module'
import { InfraModule } from '@/infra/infra.module'
import { appEnv, cloudinaryEnv, jwtEnv, redisEnv } from '@/config/env'
import { IS_DEV_ENV } from '@/shared/utils'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true,
			load: [appEnv, redisEnv, cloudinaryEnv, jwtEnv]
		}),

		InfraModule,
		ApiModule
	]
})
export class AppModule {}