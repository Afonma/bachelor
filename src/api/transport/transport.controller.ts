import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { CreateTransportRequest, PatchTransportRequest, TransportResponse } from './dto'
import { TransportService } from './transport.service'

@Controller('transport')
export class TransportController {
	constructor(private readonly transportService: TransportService) {}

	@Post('/')
	@HttpCode(HttpStatus.CREATED) //succesful request 201
	@ApiOperation({
		summary: 'Create a transport'
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Transport was successfully created',
		type: TransportResponse
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid data'
	})
	public async createTransport(@Body() dto: CreateTransportRequest) {
		return this.transportService.create(dto)
	}

	@Get('/')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Get all transports'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Returns list of all transports',
		type: [TransportResponse]
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid data'
	})
	public async getAll() {
		return this.transportService.getAll()
	}

	@Get('/:id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Get transport by id'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Returns transport by id',
		type: TransportResponse
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid data'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Transport not found'
	})
	public async getById(@Param('id') id: string) {
		return this.transportService.getById(id)
	}

	@Patch('/:id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Update transport by id'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Transport is successfully updated',
		type: TransportResponse
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid data'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Transport not found'
	})
	public async patchTransport(@Param('id') id: string, @Body() dto: PatchTransportRequest) {
		return this.transportService.patchTransport(id, dto)
	}

	@Delete('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Delete transport by id'
	})
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'Transport is deleted'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Transport not found'
	})
	public async removeTransport(@Param('id') id: string) {
		return this.transportService.remove(id)
	}
}
