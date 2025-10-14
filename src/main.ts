import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { setupSwagger } from './common/utils'
import { getCorsConfig, getValidationPipeConfig } from './config'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	const config = app.get(ConfigService)

	const logger = new Logger(AppModule.name)

	app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')))
	app.useGlobalPipes(new ValidationPipe(getValidationPipeConfig()))
	app.enableCors(getCorsConfig(config))

	setupSwagger(app)

	const port = config.getOrThrow<number>('HTTP_PORT')
	const host = config.getOrThrow<string>('HTTP_HOST')

	try {
		await app.listen(port)

		logger.log(`🚀 Server is running at: ${host}`)
		logger.log(`📄 Documentation is available at: ${host}/docs`)
	} catch (error) {
		logger.error(`Failed to start server: ${error.message}`, error)
		process.exit(1)
	}
}
void bootstrap()
