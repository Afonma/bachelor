import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { CreateTeamRequest } from './dto/create-team.dto'
import { TeamService } from './team.service'

@Controller('teams')
export class TeamController {
	constructor(private readonly teamService: TeamService) {}

	@Post()
	public async create(@Body() dto: CreateTeamRequest) {
		return this.teamService.create(dto)
	}

	@Get()
	public async getAll() {
		return this.teamService.getAll()
	}

	@Get('/:id')
	public async getById(@Param('id') id: string) {
		return this.teamService.getById(id)
	}

	@Patch('/:id')
	public async patchTeam(@Param('id') id: string, @Body() dto: CreateTeamRequest) {
		return this.teamService.patchTeam(id, dto)
	}

	@Delete('/:id')
	public async removeTeam(@Param('id') id: string) {
		return this.teamService.removeTeam(id)
	}
}
