import { UseGuards } from '@nestjs/common'

import { JwtAuthGuard, RolesGuard } from '../guards'

export const Protected = () => UseGuards(JwtAuthGuard, RolesGuard)
