import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'

import { CreateTeamRequest } from './dto/create-team.dto'
import { TeamService } from './team.service'

@Controller('team')
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

	@Get()
	public async getById(@Param('id') id: string) {
		return this.teamService.getById(id)
	}

	@Post()
	public async patchTeam(@Param('id') id: string, @Body() dto: CreateTeamRequest) {
		return this.teamService.patchTeam(id, dto)
	}

	@Delete()
	public async removeTeam(@Param('id') id: string) {
		return this.teamService.removeTeam(id)
	}
}
