import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { QueryPaginationRequest } from '@/shared/dtos'

import { CreateManufacturerRequest } from './dto/create-manufacturer.dto'
import { ManufacturerResponse } from './dto/manufacturer.dto'
import { PatchManufacturerRequest } from './dto/patch-manufacturer.dto'
import { ManufacturerService } from './manufacturer.service'

@Controller('manufacturer')
export class ManufacturerController {
	constructor(private readonly manufacturerService: ManufacturerService) {}

	@Post('/')
	@ApiOperation({
		summary: 'Create a manufacturer'
	})
	@HttpCode(HttpStatus.CREATED)
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Manufacturer was succesfully created',
		type: ManufacturerResponse
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid manufacturer data'
	})
	public async create(@Body() dto: CreateManufacturerRequest) {
		return this.manufacturerService.createManufacturer(dto)
	}

	@Get('/')
	@ApiOperation({
		summary: 'Get all manufacturers'
	})
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Find all manufacturers',
		type: [ManufacturerResponse]
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid manufacturer data'
	})
	public async getAll(@Query() query: QueryPaginationRequest) {
		return this.manufacturerService.getAll(query)
	}

	@Get('/:id')
	@ApiOperation({
		summary: 'Find manufacturer by id'
	})
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Returns a manufacturer by id',
		type: ManufacturerResponse
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid manufacturer data'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Manufacturer not found'
	})
	public async getById(@Param('id') id: string) {
		return this.manufacturerService.getById(id)
	}

	@Patch('/:id')
	@ApiOperation({
		summary: 'Update task by id'
	})
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Manufacturer is successfully updated',
		type: ManufacturerResponse
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid manufacturer data'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Manufacturer not found'
	})
	public async patch(@Param('id') id: string, @Body() dto: PatchManufacturerRequest) {
		return this.manufacturerService.patchManufacturer(id, dto)
	}

	@Delete('/:id')
	@ApiOperation({
		summary: 'Delete manufacturer by id'
	})
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'Manufacturer is deleted'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Manufacturer not found'
	})
	public async remove(@Param('id') id: string) {
		return this.manufacturerService.removeManufacturer(id)
	}
}
