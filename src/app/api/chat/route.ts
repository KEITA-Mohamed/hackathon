import prisma from "@/lib/prisma/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
       const userId = req.nextUrl.searchParams.get("userId");
       console.log('---------------------------------', userId);
            
        if (!userId) {
            return NextResponse.json({ errors: { message: "userId manquant" } }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (user) {
            return NextResponse.json(user)
        } else {
            return NextResponse.json({ errors: { message: "user non trouvé" } }, { status: 400 })
        }
    } catch (e) {
        console.error("Error finding user: ", e)
        return NextResponse.json({ errors: { message: "Failed to find user by ID" } }, { status: 500 })
    }
}

