import { cookies, headers } from "next/headers"
import { jwtVerify } from "jose"
import { prisma } from "@/lib/prisma/prisma"
import {checkExpirationToken} from "@/lib/jwt";


const secretKey = new TextEncoder().encode(process.env.SECRET_KEY ?? "secrect_par_defaut")


export async function getCurrentUser() {
    const cookieStore = await cookies();
    try {
        const userCookie = cookieStore.get("user")
        if (userCookie) {
            return JSON.parse(userCookie.value)
        }

        const jwtCookie = cookieStore.get("jwt")
        if (!jwtCookie) {
            return null
        }

        const { payload } = await jwtVerify(jwtCookie.value, secretKey)
        const userId = payload.sub

        if (!userId) {
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: userId as string },
        })

        if (user) {
            cookieStore.set("user", JSON.stringify(user))
        }

        return {user}
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

export async function getCurrentUserId(): Promise<string | null> {
    const token = (await cookies()).get("jwt")?.value;
    if (!token) return null;

    try {
        const result = await checkExpirationToken(token);

        if (result.newToken) {
            const cookieStore = await cookies();
            cookieStore.set("jwt", result.newToken);
        }

        return result.payload.sub as string ?? null;
    } catch (err) {
        console.error("JWT echec de vérification:", err);
        return null;
    }
}
