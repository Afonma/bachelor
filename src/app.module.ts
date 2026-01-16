import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'


@Module({
	imports: [
		ConfigModule.forRoot({
		}),
		InfraModule,
		ApiModule
	]
})
export class AppModule {}
