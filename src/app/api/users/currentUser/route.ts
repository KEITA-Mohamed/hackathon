import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { checkExpirationToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
    try {

        const jwtCookie = req.cookies.get("jwt");

        if (!jwtCookie || !jwtCookie.value) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }


        const result = await checkExpirationToken(jwtCookie.value);
        const payload = result.payload;

        if (!payload.sub) {
            return NextResponse.json({ error: "Token invalide" }, { status: 401 });
        }

        const userId = payload.sub;


        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                role: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}