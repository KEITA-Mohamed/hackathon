import prisma from "@/lib/prisma/prisma";
import {NextRequest, NextResponse} from "next/server";
import { v4 as uuidv4 } from "uuid"
import moment from "moment"
import emailService from "@/lib/email"


export async function POST(req: NextRequest){

    try {
        const { firstName, lastName, email, role} = await req.json();

        if (!firstName || !lastName || !email || !role) {
            return NextResponse.json(
                { errors: { message: "Tous les champs doivent être remplis." } },
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


        const baseToken = uuidv4();
        const passwordToken = `_INV_${baseToken}`
        const newUser = await prisma.user.create({
                data: {
                    firstname: firstName,
                    lastname: lastName,
                    email,
                    password: null,
                    role,
                    passwordToken,
                    passwordTokenEXPIRATION: moment().add(2, "hours").toDate(),


                },
            });


        await emailService.sendInviteMenber({
            to: email,
            host: req.headers.get("host") || "",
            userId: newUser.id,
            token: passwordToken,
        })
            return NextResponse.json(
                {message: `${newUser.firstname} ${newUser.lastname} va recevoir un email d'invitation`},
                {status: 201}
                );



    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        return NextResponse.json(
            { errors: { message: "Erreur interne du serveur." } },
            { status: 500 }
        );
    }

}
