import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from 'src/common/strategies'
import { getJwtConfig } from 'src/config'
import { RedisModule } from 'src/infra/redis/redis.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getJwtConfig,
			inject: [ConfigService]
		}),
		RedisModule,
		PassportModule
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
