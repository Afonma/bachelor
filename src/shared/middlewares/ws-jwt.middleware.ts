import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { JwtPayload } from 'jsonwebtoken'
import type { Socket } from 'socket.io'

import { PrismaService } from '@/infra/prisma/prisma.service'

export function wsJwtMiddleware(jwtService: JwtService, prismaService: PrismaService, configService: ConfigService) {
	return async function (client: Socket, next: (err?: any) => void) {
		try {
			const auth = client.handshake.headers.authorization
			if (!auth) return next(new Error('Unauthorized'))

			const token = auth.replace('Bearer', '').trim()
			const payload = jwtService.verify<JwtPayload>(token, {
				secret: configService.getOrThrow<string>('JWT_SECRET')
			})

			const user = await prismaService.user.findUnique({
				where: { id: payload.id },
				select: { id: true }
			})

			if (!user) return next(new Error('Unauthorized'))

			client.data.user = user

			next()
		} catch (err) {
			next(new Error('Unauthorized'))
		}
	}
}
