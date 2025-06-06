import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

export default async function GET (req: NextRequest) {
    try {
        const users = await prisma.user.findMany();
        console.log(users);
        return NextResponse.json(users);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
} 