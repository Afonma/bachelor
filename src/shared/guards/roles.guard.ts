import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PrismaService } from 'src/infra/prisma/prisma.service'

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly reflector: Reflector
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()])
		if (!roles) return true

		const request = context.switchToHttp().getRequest()
		const user = await this.prismaService.user.findUnique({
			where: {
				id: request.user.id
			}
		})

		if (!user || !roles.includes(user.role)) throw new ForbiddenException("You don't have a permission to access this resource")
		return true
	}
}
