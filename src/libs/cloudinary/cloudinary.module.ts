import { DynamicModule, Module } from '@nestjs/common'

import { CloudinaryService } from './cloudinary.service'
import { type CloudinaryAsyncOptions, type CloudinaryOptions, CloudinaryOptionsSymbol } from './interfaces/options.interfaces'

@Module({})
export class CloudinaryModule {
	public static forRoot(options: CloudinaryOptions): DynamicModule {
		return {
			module: CloudinaryModule,
			providers: [
				{
					provide: CloudinaryOptionsSymbol,
					useValue: options
				},
				CloudinaryService
			],
			exports: [CloudinaryService],
			global: true
		}
	}

	public static forRootAsync(options: CloudinaryAsyncOptions): DynamicModule {
		return {
			module: CloudinaryModule,
			providers: [
				{
					provide: CloudinaryOptionsSymbol,
					useFactory: options.useFactory,
					inject: options.inject || []
				},
				CloudinaryService
			],
			exports: [CloudinaryService],
			global: true
		}
	}
}
