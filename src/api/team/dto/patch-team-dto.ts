import { PartialType } from '@nestjs/swagger'

import { CreateTeamRequest } from './create-team.dto'

export class PatchTeamRequest extends PartialType(CreateTeamRequest) {}
