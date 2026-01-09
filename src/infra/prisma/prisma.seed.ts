import { ChatType, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	try {
		console.log('🔄 Seeding database')

		await prisma.chat.deleteMany()
		await prisma.chat.createMany({
			data: {
				name: 'General',
				type: ChatType.GENERAL
			}
		})

		console.log('✅ Seeding finished')
	} catch (error) {
		console.log(error)
		throw new Error('❌ Failed to seed the database')
	}
}

void main()
