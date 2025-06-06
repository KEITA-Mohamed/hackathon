"use client"
import './style.scss';
import { useSearchParams } from "next/navigation"
import ResetPasswordForm from "@/components/sigin-form/reset-password/ResetPasswordForm"

export default function passwordResetPage() {
    const searchParams = useSearchParams()
    const userId = searchParams.get("userId")
    const token = searchParams.get("token")

    if (!userId || !token) {
        return (
            <div className='main-container-error'>
                <div className='error-container'>
                    <h1>Lien invalide</h1>
                    <p>
                        Le lien de réinitialisation de mot de passe est invalide ou a expiré. Veuillez demander un nouveau lien de
                        réinitialisation.
                    </p>
                </div>
            </div>
        )
    }

    return <ResetPasswordForm userId={userId!} token={token!} />
}