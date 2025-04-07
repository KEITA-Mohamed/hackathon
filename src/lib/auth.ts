import { cookies, headers } from "next/headers"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma/prisma"


const secretKey = new TextEncoder().encode(process.env.SECRET_KEY ?? "secrect_par_defaut")

// Fonction pour récupérer l'utilisateur actuel dans les Server Components
export async function getCurrentUser() {
    const cookieStore = await cookies();
    try {
        // 1. Essayer d'abord de récupérer l'utilisateur depuis les cookies
        const userCookie = cookieStore.get("user")
        if (userCookie) {
            return JSON.parse(userCookie.value)
        }

        // 2. Si pas dans les cookies, vérifier le token JWT
        const jwtCookie = cookieStore.get("jwt")
        if (!jwtCookie) {
            return null
        }

        // 3. Vérifier et décoder le token
        const { payload } = await jwtVerify(jwtCookie.value, secretKey)
        const userId = payload.sub

        if (!userId) {
            return null
        }

        // 4. Récupérer l'utilisateur depuis la base de données
        const user = await prisma.user.findUnique({
            where: { id: userId as string },
        })

        if (user) {
            // 5. Stocker l'utilisateur dans les cookies pour les prochaines requêtes
            cookieStore.set("user", JSON.stringify(user))
        }

        return user
    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error)
        return null
    }
}


export async function getUserFromRequest() {
    try {
        const headersList = await headers()
        const userId = headersList.get("X-User-ID")

        if (!userId) {
            return null
        }

        return await prisma.user.findUnique({
            where: { id: userId },
        })
    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error)
        return null
    }
}

