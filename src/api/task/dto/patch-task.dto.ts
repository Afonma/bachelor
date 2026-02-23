import { PartialType } from '@nestjs/swagger'

import { CreateSubTaskRequest, CreateTaskRequest } from './create-task.dto'

export class PatchTaskRequest extends PartialType(CreateTaskRequest) {}

export class PatchSubTaskRequest extends PartialType(CreateSubTaskRequest) {}
