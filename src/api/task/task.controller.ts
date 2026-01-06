import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { QueryPaginationRequest } from '@/shared/dtos'

import { CreateTaskRequest, PatchTaskRequest, TaskResponse } from './dto'
import { TaskService } from './task.service'

@Controller('tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Post('/')
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
	public async create(@Body() dto: CreateTaskRequest) {
		return this.taskService.create(dto)
	}

	@Get('/')
	@HttpCode(HttpStatus.OK)
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
	public async getAll(@Query() query: QueryPaginationRequest) {
		return this.taskService.getAll(query)
	}

	@Get('/:id')
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
	public async updateTask(@Param('id') id: string, @Body() dto: PatchTaskRequest) {
		return this.taskService.patchTask(id, dto)
	}

	@Delete('/:id')
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
