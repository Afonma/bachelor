import { PartialType } from '@nestjs/swagger'

import { CreateUserRequest } from './create-user.dto'

export class PatchUserRequest extends PartialType(CreateUserRequest) {}
