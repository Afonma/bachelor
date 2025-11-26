import { PartialType } from '@nestjs/swagger'

import { CreateTaskRequest } from './create-task.dto'

export class PatchTaskRequest extends PartialType(CreateTaskRequest) {}
