import { Inject, Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { $Enums } from '@prisma/client'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	createMfaTicket(id: string, allowedMethods: string[]) {
		throw new Error('Method not implemented.')
	}
	createSession(
		admin: {
			id: string
			firstname: string
			email: string
			password: string
			lastname: string | null
			phone: string | null
			role: $Enums.UserRole
			teamId: string | null
			createdAt: Date
			updatedAt: Date
		},
		arg1: { ip: string; userAgent: string }
	) {
		throw new Error('Method not implemented.')
	}
	private readonly logger = new Logger(RedisService.name)
	public constructor(
		@Inject('REDIS_CLIENT')
		private readonly redis: Redis
	) {}

	public async onModuleInit() {
		this.logger.log('🔄 Initializing Redis connection...')

		try {
			const pong = await this.redis.ping()
			this.logger.log(`✅ Redis connection established. PING response: ${pong}`)
		} catch (error) {
			this.logger.error('❌ Failed to connect to Redis', error)
		}
	}

	public onModuleDestroy() {
		this.logger.warn('⚙️ Disconnecting from Redis...')
		this.redis.quit()
		this.logger.log('🔌 Redis disconnected successfully')
	}

	public async set(key: string, value: string) {
		return await this.redis.set(key, value)
	}

	public async get(key: string) {
		return await this.redis.get(key)
	}

	public async del(key: string) {
		return await this.redis.del(key)
	}

	public async sadd(key: string, value: string) {
		return this.redis.sadd(key, value)
	}

	public async srem(key: string, value: string) {
		return this.redis.srem(key, value)
	}

	public async scard(key: string) {
		return this.redis.scard(key)
	}

	public async smembers(key: string) {
		return this.redis.smembers(key)
	}

	public async delIfEmpty(key: string) {
		const size = await this.redis.scard(key)

		if (size === 0) {
			await this.redis.del(key)
			return true
		}

		return false
	}

	public async setTokenToBlackList(token: string, exp: number) {
		return await this.redis.set(token, 'true', 'EX', exp)
	}
}
