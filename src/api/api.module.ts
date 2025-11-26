import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { ManufacturerModule } from './manufacturer/manufacturer.module'
import { TaskModule } from './task/task.module'
import { TeamModule } from './team/team.module'
import { TransportModule } from './transport/transport.module'
import { UploadModule } from './upload/upload.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [AuthModule, UsersModule, TeamModule, ManufacturerModule, TransportModule, TaskModule, UploadModule]
})
export class ApiModule {}
