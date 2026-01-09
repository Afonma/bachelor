import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { getJwtConfig } from '@/config'
import { PrismaModule } from '@/infra/prisma/prisma.module'
import { RedisModule } from '@/infra/redis/redis.module'

import { ChatGateway } from './chat.gateway'
import { ChatService } from './chat.service'

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getJwtConfig,
			inject: [ConfigService]
		}),

		RedisModule,
		PrismaModule
	],
	providers: [ChatGateway, ChatService]
})
export class ChatModule {}
