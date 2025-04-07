interface ResetPasswordOptions {
    host: string;
    userId: string;
    token: string;
    url: string;
}

export function getPasswordResetTemplate(options: ResetPasswordOptions): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Réinitialisation de mot de passe</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Réinitialisation de mot de passe</h1>
            <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
            <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
            <p>
                <a class="button" href="${options.url}">
                    Réinitialiser mon mot de passe
                </a>
            </p>
            <p>Ce lien expirera dans 2 heure.</p>
            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
        </div>
    </body>
    </html>
  `;
}