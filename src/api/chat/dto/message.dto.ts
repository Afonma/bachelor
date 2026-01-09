import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class MessageRequest {
	@ApiProperty({
		description: 'This is the message',
		example: 'Hello! How are you :)?'
	})
	@IsString({ message: 'Content must be a string' })
	public content: string

	@ApiProperty({
		description: 'This is the chat id',
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f'
	})
	@IsString({ message: 'Chat ID must be a string' })
	@IsOptional()
	public chatId?: string
}
