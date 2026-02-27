import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger'
import type { User } from '@prisma/client'

import { Authorized, Protected, Roles } from '@/shared/decorators'
import { QueryPaginationRequest } from '@/shared/dtos'

import { CreateUserRequest, PatchUserRequest, UserResponse, UsersResponse } from './dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('/')
	@Roles('ADMIN')
	@Protected()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a new user' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'User successfully created',
		type: UserResponse
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid user data'
	})
	public async create(@Body() dto: CreateUserRequest) {
		return this.usersService.create(dto)
	}

	@Get('/')
	@Roles('ADMIN')
	@Protected()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get all users' })
	@ApiOkResponse({
		description: 'List of users',
		type: UsersResponse
	})
	public async getAll(@Query() query: QueryPaginationRequest) {
		return this.usersService.getAll(query)
	}

	@Get('/@me')
	@Protected()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get the currently authenticated user' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Returns information about the current user',
		type: UserResponse
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: 'User is not authorized'
	})
	public async getMe(@Authorized() user: User) {
		return this.usersService.getById(user.id)
	}

	@Get('/:id')
	@Roles('ADMIN')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get user by ID' })
	@ApiOkResponse({
		description: 'User information',
		type: UserResponse
	})
	public async getById(@Param('id') id: string) {
		return this.usersService.getById(id)
	}

	@Patch('/:id')
	@Roles('ADMIN')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Update the currently authenticated user' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'User successfully updated',
		type: UserResponse
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid update data'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'User not found'
	})
	public async patchUser(@Param('id') id: string, @Body() dto: PatchUserRequest) {
		return this.usersService.patchUser(id, dto)
	}

	@Delete('/:id')
	@Protected()
	@Roles('ADMIN')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete user by ID' })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'User successfully deleted'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'User not found'
	})
	public async remove(@Param('id') id: string) {
		return this.usersService.remove(id)
	}
}
