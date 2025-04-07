
import { cookies } from "next/headers"

import { jwtVerify, SignJWT, decodeJwt } from "jose"
import { NextRequest} from "next/server"



export const secretKey  = new TextEncoder().encode(process.env.SECRET_KEY ?? "secrect_par_defaut")


type UserRole = "ADMIN" | "TEACHER" | "STUDENT";


interface CreateJwtTokenParams {
    user?: {
        id?: string;
        role?: UserRole;
    } | null;
    id?: string | null;
    role?: UserRole | null;
}
export const createJwtToken = async ({ user = null, id = null, role = null }: CreateJwtTokenParams): Promise<string> => {

    const userRole: UserRole | undefined = role || user?.role;


    const jwtToken = await new SignJWT({
        role: userRole
    })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(id || user?.id?.toString() || "")
        .setExpirationTime("30s")
        .setIssuedAt()
        .sign(secretKey)

    console.log("Nouveau token créé :", jwtToken);
    return jwtToken
}

export const checkExpirationToken = async (token: string) => {
    try {

        if (!token || token === "undefined" || token === "null") {
            console.log("Token vide ou malformé");
            throw new Error("Token vide ou malformé");
        }


        let payload;
        try {
            payload = decodeJwt(token);
            console.log("Payload du token décodé :", payload);
        } catch (decodeError) {
            console.error("Erreur lors du décodage du token:", decodeError);
            throw new Error("Token malformé");
        }


        if (!payload.exp) {
            console.log("Le token ne contient pas de date d'expiration");
            throw new Error("Le token ne contient pas de date d'expiration");
        }

        if (!payload.sub) {
            console.log("Le token ne contient pas de sub");
            throw new Error("Le token ne contient pas de sub");
        }

        const tokenExp = payload.exp;
        const nowInSec = Math.floor(Date.now() / 1000);
        console.log(`Expiration du token: ${tokenExp}, Heure actuelle: ${nowInSec}, Différence: ${tokenExp - nowInSec}s`);


        try {

            await jwtVerify(token, secretKey, {
                clockTolerance: 5,
            });
            console.log("Signature valide");


            if (nowInSec <= tokenExp) {
                console.log("Token valide et non expiré");
                return { payload };
            }
        } catch (verifyError: Error | any) {

            if ((verifyError).code !== 'ERR_JWT_EXPIRED') {
                console.error("Signature invalide:", verifyError);
                throw new Error("Signature du token invalide");
            }

            console.log("Token expiré selon jose");
        }


        if (nowInSec - tokenExp < 300) {
            console.log("Token expiré mais rafraîchissable");

            const userRole = payload.role || "";
            const refreshedToken = await createJwtToken({
                id: payload.sub,
                role: userRole as UserRole
            });
            console.log("Token rafraîchi avec succès");
            return { newToken: refreshedToken, payload };
        } else {
            console.log(`Token expiré depuis trop longtemps: ${nowInSec - tokenExp}s`);
            throw new Error("Token expiré et non rafraîchissable");
        }
    } catch (error) {
        console.error("Erreur dans checkExpirationToken:", error);
        throw new Error(`Token invalide ou expiré: ${(error as Error).message}`);
    }
};

export async function extractUserFromToken(req: NextRequest) {

    const jwtCookie = req.cookies.get("jwt");

    if (!jwtCookie || !jwtCookie.value) {
        console.log("Pas de token JWT dans extractUserFromToken");
        return null;
    }

    try {

        const result = await checkExpirationToken(jwtCookie.value);

        const userId = result.payload.sub;
        if (!userId) {
            console.log("Le token ne contient pas d'identifiant utilisateur");
            return null;
        }


        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${req.headers.get("host")}`;
        const apiUrl = `${baseUrl}/api/login?userId=${userId}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

            cache: 'force-cache'
        });

        if (!response.ok) {
            console.log(`Erreur API: ${response.status}`);
            return null;
        }

        const user = await response.json();
        return user;
    } catch (e) {
        console.log("Erreur dans extractUserFromToken:", e);
        return null;
    }
}
export const addJwtFeatures = () => {
    const isAuthenticated = async () => {
        const cookieStore = await cookies()
        const jwtCookie = cookieStore.get("jwt")

        if (!jwtCookie) return false

        try {
            await jwtVerify(jwtCookie.value, secretKey)
            return true
        } catch {
            return false
        }
    }

    const logout = async () => {
        const cookieStore = await cookies()
        cookieStore.delete("jwt")
    }

    const login = async (user: any) => {
        const cookieStore = await cookies()
        const token = await createJwtToken({ user, role: user.role })
        cookieStore.set("jwt", token)
    }

    return { isAuthenticated, logout, login }
}



