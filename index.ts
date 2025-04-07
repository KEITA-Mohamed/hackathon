import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // ... you will write your Prisma Client queries here
    await prisma.user.create({
        data:{

            firstname: "toto",
            lastname: "totonom",
            email: "to@to.fr",
            password: "1234",
            role: "ADMIN",

            chat: {
                create:[
                    {
                        prompt: "Hello world",
                        answer: "Super",
                        model: "CLAUDE"
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