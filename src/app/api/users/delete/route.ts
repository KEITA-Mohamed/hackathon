import prisma from "@/lib/prisma/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest) {
    try {
        const url = new URL(req.url)
        const id: string | null = url.searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "ID requis" }, { status: 400 })
        }

        await prisma.user.delete({
            where: { id },
        })

        return NextResponse.json({ message: "Utilisateur supprimé" }, { status: 200 })
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error)
        return NextResponse.json(
            { error: "Erreur interne du serveur" },
            { status: 500 }
        )
    }
}
