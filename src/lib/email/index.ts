import nodemailer from "nodemailer";
import {getPasswordResetTemplate} from "@/lib/email/templates/resetPassword";
import {getInviteTemplate} from "@/lib/email/templates/inviteMember";

class Email {
    private from: string
    private transporter: nodemailer.Transporter

    constructor() {

        this.from = "HACKATHON <no-reply@hackathon.fr>";

        this.transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILLER_PASS
            }
        });

        /*
        if (process.env.NODE_ENV === 'production') {
            this.transporter = nodemailer.createTransport(
                sparkPostTransport({
                    sparkPostApiKey: process.env.SPARKPOST_API_KEY
                })
            );
        }
        */
    }

    async sendInviteMenber(options:{
        to: string;
        host: string;
        userId: string;
        token: string;


    }){
        try {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const inviteUrl = `${baseUrl}/api/users/resetPassword?userId=${options.userId}&token=${options.token}`;

            const email = {
                from: this.from,
                subject: "Invitation",
                to: options.to,
                html: getInviteTemplate({
                    host: options.host,
                    userId: options.userId,
                    token: options.token,
                    url: inviteUrl,
                })
            };

            const response = await this.transporter.sendMail(email);
            console.log("Email envoyé:", response.messageId);
            return response;
        } catch (e) {
            console.error("Erreur d'envoi d'email:", e);
            throw e;
        }
    }

    async sendResetPasswordLink(options: {
        to: string;
        host: string;
        userId: string;
        token: string;

    }) {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const url = `${baseUrl}/api/users/resetPassword?userId=${options.userId}&token=${options.token}`

            const email = {
                from: this.from,
                subject: "Réinitialisation de mot de passe",
                to: options.to,
                html: getPasswordResetTemplate({
                    host: options.host,
                    userId: options.userId,
                    token: options.token,
                    url: url,
                })
            };

            const response = await this.transporter.sendMail(email);
            console.log("Email envoyé:", response.messageId);
            return response;
        } catch (e) {
            console.error("Erreur d'envoi d'email:", e);
            throw e;
        }
    }

}

export default new Email();