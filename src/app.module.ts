import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './api/auth/auth.module'
import { StatisticsModule } from './api/statistics/statistics.module'
import { TaskModule } from './api/task/task.module'
import { TeamModule } from './api/team/team.module'
import { UsersModule } from './api/users/users.module'
import { InfraModule } from './infra/infra.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		InfraModule,
		UsersModule,
		TeamModule,
		TaskModule,
		StatisticsModule,
		AuthModule
	]
})
export class AppModule {}
