import { DocumentBuilder } from '@nestjs/swagger'

export function getSwaggerConfig() {
	return new DocumentBuilder()
		.setTitle('bachelor API')
		.setDescription('API for bachelor platform')
		.setVersion('1.0.0')
		.setContact('Bachelor support', 'https://web.telegram.org/k/#@Afonma', 'mishaafanasiev1@gmail.com')
		.build()
}
