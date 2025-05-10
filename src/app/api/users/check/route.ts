import prisma from "@/lib/prisma/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url)
        const email = url.searchParams.get("email")

        if (!email) {
            return NextResponse.json({ errors: { message: "Email requis" } }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        })

        return NextResponse.json({ exists: !!user }, { status: 200 })
    } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error)
        return NextResponse.json({ errors: { message: "Erreur interne du serveur" } }, { status: 500 })
    }
}
