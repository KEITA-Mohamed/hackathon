import prisma from "@/lib/prisma/prisma";
import * as bcrypt from "bcrypt";
import {NextRequest, NextResponse} from "next/server";


export async function POST(request: NextRequest){


    try {
        const { prenom, nom, email, password, confirmPassword, role} = await request.json();


        if (!prenom || !nom || !email || !password || !confirmPassword || !role) {
            return NextResponse.json(
                { errors: { message: "Tous les champs doivent être remplis." } },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { errors: { message: "Les mots de passe ne correspondent pas." } },
                { status: 400 }
            );
        }


        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { errors: { message: "Un utilisateur avec cet email existe déjà." } },
                { status: 400 }
            );
        }


        const hashedPassword = await bcrypt.hash(password, 10);



            const newUser = await prisma.user.create({
                data: {
                    firstname: prenom,
                    lastname: nom,
                    email,
                    password: hashedPassword,
                    role,
                    isActive: true

                },
            });
            return NextResponse.json(newUser, { status: 201 });

    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        return NextResponse.json(
            { errors: { message: "Erreur interne du serveur." } },
            { status: 500 }
        );
    }

}
