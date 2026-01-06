import { type OnGatewayConnection, type OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { type Server } from 'socket.io'

import { PrismaService } from '@/infra/prisma/prisma.service'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	public server: Server

	public constructor(private readonly prismaService: PrismaService) {}

	private onlineUsers = new Map<string, string>()

	public async handleConnection() {}

	public async handleDisconnect() {}

	@SubscribeMessage('message')
	public async onMessage() {}

	@SubscribeMessage('join')
	public async onJoin() {}

	@SubscribeMessage('leave')
	public async onLeave() {}
}
