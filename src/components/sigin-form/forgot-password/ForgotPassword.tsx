"use client"
import './ForgotPassword.scss'
import type React from "react"
import { useState } from "react"

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            setMessage({ type: "error", text: "Veuillez saisir votre adresse email" })
            return
        }

        setIsLoading(true)

        try {

            const response = await fetch("/api/users/initResetPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                setEmail("")
                setMessage({
                    type: "success",
                    text: "Si un compte existe avec cette adresse email, vous recevrez un lien pour réinitialiser votre mot de passe.",
                })
            } else {

                setMessage({
                    type: "error",
                    text: data.message || "Une erreur est survenue",
                })
            }
        } catch (error) {
            setMessage({ type: "error", text: "Une erreur est survenue. Veuillez réessayer plus tard." })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="main-container">
            <header>
                <h1>Mot de passe oublié</h1>
                {/* <p>Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.</p> */}
            </header>
            <form onSubmit={handleSubmit}>
                <div className='form-container'>
                    <div>
                        <h2>Adresse email</h2>
                        <input
                            id="email"
                            type="email"
                            placeholder="exemple@domaine.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {message && (
                        <div
                            className={`mt-4 p-3 rounded-md ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                            {message.text}
                        </div>
                    )}
                </div>
                <footer>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Envoi en cours..." : "Réinitialisation"}
                    </button>
                </footer>
            </form>
        </div>
    )
}

