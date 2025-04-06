import prisma from "@/lib/prisma/prisma"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import moment from "moment"
import emailService from "@/lib/email"

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ message: "Email requis" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })

        if (user) {
            const passwordToken = uuidv4()

            const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                    passwordToken,
                    passwordTokenEXPIRATION: moment().add(2, "hours").toDate(),
                },
            })


            await emailService.sendResetPasswordLink({
                to: email,
                host: req.headers.get("host") || "",
                userId: user.id,
                token: passwordToken,
            })
        }


        return NextResponse.json({
            message:
                "Si un compte existe avec cette adresse email, vous recevrez un lien pour réinitialiser votre mot de passe.",
        })
    } catch (e) {
        console.error("Erreur lors de l'initialisation de la réinitialisation du mot de passe:", e)
        return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
    }
}

