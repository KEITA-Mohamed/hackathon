interface InviteOptions {
     host: string;
    userId: string;
    token: string;
    firstName?: string;
    role?: string;
    url: string;
}

export function getInviteTemplate(options: InviteOptions): string {

    const greeting = options.firstName ? `Bonjour ${options.firstName},` : 'Bonjour,';


    let roleMessage = '';

    if (options.role) {
        const roleName = options.role === 'ADMIN' ? 'administrateur' :
            options.role === 'TEACHER' ? 'enseignant' :
                options.role === 'STUDENT' ? 'étudiant' : 'utilisateur';
        roleMessage = `Vous avez été invité(e) à rejoindre notre plateforme en tant que ${roleName}.`;
    } else {
        roleMessage = 'Vous avez été invité(e) à rejoindre notre plateforme.';
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Invitation à rejoindre notre plateforme</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4361ee; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #4361ee; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; }
            .link { word-break: break-all; color: #4361ee; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Invitation à rejoindre notre plateforme</h1>
            </div>
            <div class="content">
                <p>${greeting}</p>
                <p>${roleMessage}</p>
                <p>Pour finaliser votre inscription et définir votre mot de passe, veuillez cliquer sur le bouton ci-dessous :</p>
                <p style="text-align: center;">
                    <a class="button" href="${options.url}">
                        Accepter l'invitation
                    </a>
                </p>
                <p>Ce lien d'invitation expirera dans 2 heures.</p>
                <p>Si vous n'attendiez pas cette invitation, veuillez ignorer cet email.</p>
            </div>
            <div class="footer">
                <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}