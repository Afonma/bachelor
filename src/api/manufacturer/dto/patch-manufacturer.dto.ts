import { PartialType } from '@nestjs/swagger'

import { CreateManufacturerRequest } from './create-manufacturer.dto'

export class PatchManufacturerRequest extends PartialType(CreateManufacturerRequest) {}
