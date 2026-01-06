import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { type User } from '@prisma/client'
import { verify } from 'argon2'
import { PrismaService } from 'src/infra/prisma/prisma.service'
import { RedisService } from 'src/infra/redis/redis.service'

import { StringValue } from '@/shared/utils'

import { LoginRequest } from './dto'
import { JwtPayload } from './interfaces'

@Injectable()
export class AuthService {
	private readonly JWT_ACCESS_TOKEN_TTL: StringValue
	private readonly JWT_REFRESH_TOKEN_TTL: StringValue
	public constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService
	) {
		this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<StringValue>('JWT_ACCESS_TOKEN_TTL')
		this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<StringValue>('JWT_REFRESH_TOKEN_TTL')
	}

	public async login(dto: LoginRequest) {
		const { email, password } = dto

		const user = await this.prismaService.user.findFirst({
			where: {
				email
			}
		})
		if (!user) throw new NotFoundException('Login is invalid')

		const isValidPassword = await verify(user.password, password)
		if (!isValidPassword) throw new NotFoundException('Login is invalid')

		const token = await this.generateToken(user)
		return {
			accessToken: token.accessToken,
			refreshToken: token.refreshToken
		}
	}

	public async logout(refreshToken: string, accessToken: string) {
		await this.redisService.setTokenToBlackList(accessToken, this.configService.getOrThrow<number>('JWT_ACCESS_TOKEN_TTL'))
		await this.redisService.setTokenToBlackList(refreshToken, this.configService.getOrThrow<number>('JWT_REFRESH_TOKEN_TTL'))
	}

	public async refresh(user: User, refreshToken: string) {
		if (!refreshToken) throw new BadRequestException('Refresh token is required')

		const payload: JwtPayload = {
			id: user.id
		}
		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.JWT_ACCESS_TOKEN_TTL
		})
		return { accessToken }
	}

	private async generateToken(user: User) {
		const payload: JwtPayload = {
			id: user.id
		}
		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.JWT_ACCESS_TOKEN_TTL
		})

		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.JWT_REFRESH_TOKEN_TTL
		})
		return {
			accessToken,
			refreshToken
		}
	}
}
