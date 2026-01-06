import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class MessageRequest {
	@ApiProperty({
		description: 'This is the message',
		example: 'Hello! How are you :)?'
	})
	@IsString({ message: 'Content must be a string' })
	public content: string

	@ApiProperty({
		description: 'This is the note message or not',
		example: false
	})
	@IsOptional()
	@IsBoolean()
	public isNote?: boolean

	@ApiProperty({
		description: 'This is the chat id',
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f'
	})
	@IsString({ message: 'Chat ID must be a string' })
	public chatId: string

	@ApiProperty({
		description: 'This is the user id',
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2'
	})
	@IsString({ message: 'User ID must be a string' })
	public userId: string
}
