"use client"
import './style.scss';
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SigninForm() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})
        setStatusMessage(null)

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                setFormData({
                    email: "",
                    password: "",
                })


                setStatusMessage({
                    type: "success",
                    message: "Connexion réussie! Redirection en cours...",
                })

                setTimeout(() => {
                    router.push("/")

                    router.refresh()
                }, 500)
            } else {
                if (data.errors) {
                    setErrors(data.errors)
                    setStatusMessage({
                        type: "error",
                        message: data.errors.message || "Identifiants incorrects",
                    })
                }
            }
        } catch (e) {
            console.error("Erreur lors de la soumission:", e)
            setStatusMessage({
                type: "error",
                message: "Une erreur est survenue lors de la connexion",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="connexion-container">
                <header>
                    <p>Connexion</p>
                </header>
                <form onSubmit={handleSubmit}>
                    {statusMessage && (
                        <div
                            className={`p-3 rounded-md ${
                                statusMessage.type === "success"
                                    ? "bg-green-100 border border-green-200 text-green-800"
                                    : "bg-red-100 border border-red-200 text-red-800"
                            }`}
                        >
                            <p>{statusMessage.message}</p>
                        </div>
                    )}

                    <div className='mail-container'>
                        <p>Email</p>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="exemple@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.email && <p className="error">{errors.email}</p>}
                    </div>

                    <div className='password-container'>
                        <div className='password-header'>
                            <p>Mot de passe</p>
                            <a href="/login/forgotPassword">Mot de passe oublié ?</a>                             
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Entrez votre mot de passe"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.password && <p className="error">{errors.password}</p>}
                    </div>
                </form>

                <footer>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Connexion en cours..." : "Se connecter"}
                    </button>
                </footer>
        </div>
    )
}

