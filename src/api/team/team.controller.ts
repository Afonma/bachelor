import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { PatchTeamRequest, TeamResponse } from './dto'
import { CreateTeamRequest } from './dto/create-team.dto'
import { TeamService } from './team.service'

@Controller('teams')
export class TeamController {
	constructor(private readonly teamService: TeamService) {}

	@Post('/')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a new team' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Team successfully was created',
		type: TeamResponse
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Ivalid team data'
	})
	public async create(@Body() dto: CreateTeamRequest) {
		return this.teamService.create(dto)
	}

	@Get('/')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get all teams' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Returns a list of all teams',
		type: [TeamResponse]
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Ivalid team data'
	})
	public async getAll() {
		return this.teamService.getAll()
	}

	@Get('/:id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get team by id' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Team was found and returned',
		type: TeamResponse
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Team not found'
	})
	public async getById(@Param('id') id: string) {
		return this.teamService.getById(id)
	}

	@Patch('/:id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Update team by id' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Team was successfully updated',
		type: TeamResponse
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Team not found'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Ivalid update data'
	})
	public async patchTeam(@Param('id') id: string, @Body() dto: PatchTeamRequest) {
		return this.teamService.patchTeam(id, dto)
	}

	@Delete('/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete team by id' })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'Team was successfully deleted'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Team not found'
	})
	public async removeTeam(@Param('id') id: string) {
		return this.teamService.remove(id)
	}
}
