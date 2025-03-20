import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  await prisma.user.create({
      data: {
          firstname: 'Niels',   
          chat: {
                create:[
                    {
                        prompt: 'Hello world',
                        answer: 'Super'
                    }

                ]
            }                             
        }
    })
    const allUsers = await prisma.user.findMany()
    console.log(allUsers)
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })