import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { Authorized, Protected, Roles } from '@/shared/decorators'
import { QueryPaginationRequest } from '@/shared/dtos'

import type { JwtPayload } from '../auth/interfaces'

import { CreateSubTaskRequest, CreateTaskRequest, PatchSubTaskRequest, PatchTaskRequest, TaskResponse } from './dto'
import { TaskService } from './task.service'

@Controller('tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Post('/')
	@Roles('ADMIN')
	@Protected()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Create a new task'
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Task is successfully created',
		type: TaskResponse
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid data'
	})
	public async createTask(@Body() dto: CreateTaskRequest) {
		return this.taskService.createTask(dto)
	}

	@Post('/subtasks')
	@Roles('HEADWORKER', 'ADMIN')
	@Protected()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: 'Create a new subtask'
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Subtask is successfully created',
		type: TaskResponse
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid data'
	})
	public async createSubTask(@Body() dto: CreateSubTaskRequest) {
		return this.taskService.createSubTask(dto)
	}

	@Get('/')
	@HttpCode(HttpStatus.OK)
	@Protected()
	@ApiOperation({
		summary: 'Get all tasks'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Returns a list of all tasks',
		type: TaskResponse
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid data'
	})
	public async getAll(@Query() query: QueryPaginationRequest, @Authorized() user: JwtPayload) {
		return this.taskService.getAll(query, user)
	}

	@Get('/:id')
	@Protected()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Get task by its id'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Returns a task by its id',
		type: TaskResponse
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Task not found'
	})
	public async getById(@Param('id') id: string) {
		return this.taskService.getById(id)
	}

	@Patch('/:id')
	@Protected()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Update the task by its id'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Task is updated',
		type: TaskResponse
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Task not found'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid data'
	})
	public async patchTask(@Param('id') id: string, @Body() dto: PatchTaskRequest, @Authorized() user: JwtPayload) {
		return this.taskService.patchTask(id, dto, user)
	}

	@Patch('/subtasks/:id')
	@Protected()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Update the subtask by its id'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Subtask is updated',
		type: TaskResponse
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Subtask not found'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid data'
	})
	public async patchSubTask(@Param('id') id: string, @Body() dto: PatchSubTaskRequest, @Authorized() user: JwtPayload) {
		return this.taskService.patchSubTask(id, dto, user)
	}

	@Delete('/:id')
	@Roles('ADMIN')
	@Protected()
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: 'Delete the task by'
	})
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'The task is deleted'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Task not found'
	})
	public async removeTask(@Param('id') id: string) {
		return this.taskService.remove(id)
	}
}
