"use client"

import { useSearchParams } from "next/navigation"
import ResetPasswordForm from "@/components/sigin-form/reset-password/ResetPasswordForm"

export default function passwordResetPage() {
    const searchParams = useSearchParams()
    const userId = searchParams.get("userId")
    const token = searchParams.get("token")

    if (!userId || !token) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200 max-w-md">
                    <h2 className="text-xl font-semibold text-red-700 mb-2">Lien invalide</h2>
                    <p className="text-red-600">
                        Le lien de réinitialisation de mot de passe est invalide ou a expiré. Veuillez demander un nouveau lien de
                        réinitialisation.
                    </p>
                </div>
            </div>
        )
    }

    return <ResetPasswordForm userId={userId} token={token} />
}