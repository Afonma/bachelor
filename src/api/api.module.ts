import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { TeamModule } from './team/team.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [AuthModule, UsersModule, TeamModule]
})
export class ApiModule {}
