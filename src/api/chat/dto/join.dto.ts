import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class JoinRequest {
	@ApiProperty({
		description: 'This is the chat id',
		example: 'c1b92d83-26c4-4b71-8c25-4a9a2f6f0c6f'
	})
	@IsString({ message: 'Chat ID must be a string' })
	public chatId: string
}
