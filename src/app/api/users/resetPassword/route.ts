import prisma from "@/lib/prisma/prisma"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import moment from "moment"
import bcrypt from "bcrypt"


export async function GET(req: NextRequest) {
    try {

        const url = new URL(req.url)
        const userId = url.searchParams.get("userId")
        const token = url.searchParams.get("token")

        if (!userId || !token) {
            return NextResponse.json({ message: "Paramètres manquants" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (!user || user.passwordToken !== token) {
            return NextResponse.json({ message: "Token invalide" }, { status: 400 })
        }

        if (!user.passwordTokenEXPIRATION || moment().isAfter(moment(user.passwordTokenEXPIRATION))) {
            return NextResponse.json({ message: "Le lien de réinitialisation a expiré" }, { status: 400 })
        }

        const isInvitation = token.includes("_INV_");

        const resetUrl = new URL("/login/passwordReset", req.url)
        resetUrl.searchParams.set("userId", user.id)
        resetUrl.searchParams.set("token", user.passwordToken)
        resetUrl.searchParams.set("type", isInvitation ? "invitation" : "reset")

        return NextResponse.redirect(resetUrl)
    } catch (e) {
        console.error("Erreur lors de la vérification du token:", e)
        return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
    }
}


export async function POST(req: NextRequest) {
    try {

        const { userId, token, password } = await req.json()

        if (!userId || !token || !password) {
            return NextResponse.json({ message: "Paramètres manquants" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (!user) {
            return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 })
        }

        if (user.passwordToken !== token) {
            return NextResponse.json({ message: "Token invalide" }, { status: 400 })
        }

        if (!user.passwordTokenEXPIRATION || moment().isAfter(moment(user.passwordTokenEXPIRATION))) {
            return NextResponse.json({ message: "Le lien de réinitialisation a expiré" }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                password: await bcrypt.hash(password, 10),
                passwordToken: null,
                passwordTokenEXPIRATION: null,
                isActive: true
            },
        })

        return NextResponse.json({ message: "Mot de passe réinitialisé avec succès" })
    } catch (e) {
        console.error("Erreur lors de la réinitialisation du mot de passe:", e)
        return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
    }
}