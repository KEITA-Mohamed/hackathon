import { NextResponse } from "next/server"
import { addJwtFeatures } from "@/lib/jwt"

export async function GET() {
    try {
        const { isAuthenticated } = addJwtFeatures()
        const authStatus = await isAuthenticated()

        return NextResponse.json({
            isAuthenticated: authStatus,
        })
    } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error)
        return NextResponse.json({ isAuthenticated: false, error: "Erreur lors de la vérification" }, { status: 500 })
    }
}

