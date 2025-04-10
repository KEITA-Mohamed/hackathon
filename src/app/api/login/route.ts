import prisma from "@/lib/prisma/prisma"
import * as bcrypt from "bcrypt"
import { type NextRequest, NextResponse } from "next/server"
import { addJwtFeatures } from "@/lib/jwt"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
            },
        })

        if (!user || !user.password) {
            return NextResponse.json({ errors: { message: "l'utilisateur n'exite pas ou il pas n'est active" } }, { status: 400 })
        }

        if (user.isActive === true) {
            const match = await bcrypt.compare(body.password, user.password)

            if (match) {
                const { login } = addJwtFeatures()


                await login(user)


                return NextResponse.json({
                    success: true,
                    message: "Authentification réussie",
                    user: {
                        id: user.id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        role: user.role
                    }
                })
            } else {
                return NextResponse.json({ errors: { message: "Identifiant ou mot de passe incorrect" } }, { status: 400 })
            }
        } else {
            return NextResponse.json({ errors: { message: "Identifiant ou mot de passe incorrect" } }, { status: 400 })
        }
    } catch (e) {
        console.error("Erreur lors de la soumission:", e)
        return NextResponse.json({ errors: { message: "Erreur interne du serveur." } }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {

        const userId = req.nextUrl.searchParams.get("userId")

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

