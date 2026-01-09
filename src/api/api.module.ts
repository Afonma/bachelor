import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module'
import { ManufacturerModule } from './manufacturer/manufacturer.module'
import { StatisticsModule } from './statistics/statistics.module'
import { TaskModule } from './task/task.module'
import { TeamModule } from './team/team.module'
import { TransportModule } from './transport/transport.module'
import { UploadModule } from './upload/upload.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [AuthModule, UsersModule, TeamModule, ManufacturerModule, TransportModule, TaskModule, UploadModule, StatisticsModule, ChatModule]
})
export class ApiModule {}
