import { DocumentBuilder } from '@nestjs/swagger'

export function getSwaggerConfig() {
	return new DocumentBuilder()
		.setTitle('BACHELOR API')
		.setDescription('API for BACHELOR product platform')
		.setVersion('1.0.0')
		.setContact('BACHELOR Support', 'https://afonma.com', 'support@afonma.com')
		.setLicense('AGPLv3', 'https://github.com/Afonma/bachelor')
		.build()
}
