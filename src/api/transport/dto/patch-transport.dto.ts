import { PartialType } from '@nestjs/swagger'

import { CreateTransportRequest } from './create-transport.dto'

export class PatchTransportRequest extends PartialType(CreateTransportRequest) {}
