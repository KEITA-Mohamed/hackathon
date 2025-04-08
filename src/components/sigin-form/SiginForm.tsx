"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
        <div className="w-full max-w-md mx-auto">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Connexion</CardTitle>
                    <CardDescription className="text-center">Entrez vos identifiants pour vous connecter</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {statusMessage && (
                            <div
                                className={`p-3 rounded-md ${
                                    statusMessage.type === "success"
                                        ? "bg-green-100 border border-green-200 text-green-800"
                                        : "bg-red-100 border border-red-200 text-red-800"
                                }`}
                            >
                                <p className="text-sm">{statusMessage.message}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="exemple@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Link href="/login/forgotPassword" className="text-sm text-primary hover:underline">
                                    Mot de passe oublié?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Entrez votre mot de passe"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Connexion en cours..." : "Se connecter"}
                        </Button>

                        <div className="text-center text-sm">
                            Vous n&apos;avez pas de compte?{" "}
                            <Link href="/inscription" className="text-primary hover:underline">
                                S&apos;inscrire
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

