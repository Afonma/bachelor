import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import type { User } from '@prisma/client'

import { Authorized, Protected, Roles } from '@/shared/decorators'

import { CreateUserRequest, PatchUserRequest, UserResponse } from './dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('/')
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

	@Patch('/@me')
	@Protected()
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
	public async updateMe(@Authorized() user: User, @Body() dto: PatchUserRequest) {
		return this.usersService.patchUser(user.id, dto)
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
