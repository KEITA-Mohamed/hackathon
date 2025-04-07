"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, EyeIcon, EyeOffIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSearchParams } from "next/navigation"

interface ResetPasswordProps {
    userId: string
    token: string
}

export default function ResetPasswordForm({ userId, token }: ResetPasswordProps) {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const searchParams = useSearchParams()

    const type = searchParams.get("type")



    const [passwordStrength, setPasswordStrength] = useState({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
    })

    const updatePasswordStrength = (password: string) => {
        setPasswordStrength({
            hasMinLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[^A-Za-z0-9]/.test(password),
        })
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value
        setPassword(newPassword)
        updatePasswordStrength(newPassword)
    }

    const isPasswordStrong = Object.values(passwordStrength).every(Boolean)
    const passwordsMatch = password === confirmPassword && password !== ""

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()


        setError(null)


        if (!password || !confirmPassword) {
            setError("Veuillez remplir tous les champs")
            return
        }

        if (!isPasswordStrong) {
            setError("Votre mot de passe ne répond pas aux critères de sécurité")
            return
        }

        if (!passwordsMatch) {
            setError("Les mots de passe ne correspondent pas")
            return
        }

        setIsLoading(true)

        try {

            const response = await fetch("/api/users/resetPassword", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    token,
                    password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Une erreur est survenue")
            }


            setSuccess(true)


            setTimeout(() => {
                router.push("/login")
            }, 500)
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de la réinitialisation du mot de passe")
        } finally {
            setIsLoading(false)
        }
    }

    const isInvitation = type === "invitation" || (token && token.includes("_INV_"))
    const pageTitle = isInvitation ? "Bienvenue sur la plateforme" : "Réinitialisation du mot de passe"
    const pageDescription = isInvitation
        ? "Créez un mot de passe pour activer votre compte"
        : "Créez un nouveau mot de passe sécurisé pour votre compte"

    const buttonText = isInvitation ? "Activer mon compte" : "Réinitialiser mon mot de passe"

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">{pageTitle}</CardTitle>
                <CardDescription>{pageDescription}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="bg-green-50 text-green-800 border-green-200">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription>
                                Votre mot de passe a été défini avec succès. Vous allez être redirigé vers la page de connexion.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="password">Nouveau mot de passe</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={isLoading || success}
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <EyeIcon className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="sr-only">{showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}</span>
                            </Button>
                        </div>


                        <div className="space-y-1 text-sm mt-2">
                            <p className="text-muted-foreground">Votre mot de passe doit contenir :</p>
                            <ul className="space-y-1">
                                <li
                                    className={`flex items-center gap-1 ${passwordStrength.hasMinLength ? "text-green-600" : "text-muted-foreground"}`}
                                >
                                    <CheckCircle2
                                        className={`h-3 w-3 ${passwordStrength.hasMinLength ? "text-green-600" : "text-muted-foreground"}`}
                                    />
                                    Au moins 8 caractères
                                </li>
                                <li
                                    className={`flex items-center gap-1 ${passwordStrength.hasUpperCase ? "text-green-600" : "text-muted-foreground"}`}
                                >
                                    <CheckCircle2
                                        className={`h-3 w-3 ${passwordStrength.hasUpperCase ? "text-green-600" : "text-muted-foreground"}`}
                                    />
                                    Au moins une majuscule
                                </li>
                                <li
                                    className={`flex items-center gap-1 ${passwordStrength.hasLowerCase ? "text-green-600" : "text-muted-foreground"}`}
                                >
                                    <CheckCircle2
                                        className={`h-3 w-3 ${passwordStrength.hasLowerCase ? "text-green-600" : "text-muted-foreground"}`}
                                    />
                                    Au moins une minuscule
                                </li>
                                <li
                                    className={`flex items-center gap-1 ${passwordStrength.hasNumber ? "text-green-600" : "text-muted-foreground"}`}
                                >
                                    <CheckCircle2
                                        className={`h-3 w-3 ${passwordStrength.hasNumber ? "text-green-600" : "text-muted-foreground"}`}
                                    />
                                    Au moins un chiffre
                                </li>
                                <li
                                    className={`flex items-center gap-1 ${passwordStrength.hasSpecialChar ? "text-green-600" : "text-muted-foreground"}`}
                                >
                                    <CheckCircle2
                                        className={`h-3 w-3 ${passwordStrength.hasSpecialChar ? "text-green-600" : "text-muted-foreground"}`}
                                    />
                                    Au moins un caractère spécial
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading || success}
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <EyeIcon className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="sr-only">
                  {showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                </span>
                            </Button>
                        </div>


                        {confirmPassword && (
                            <p
                                className={`text-sm mt-1 flex items-center gap-1 ${passwordsMatch ? "text-green-600" : "text-red-600"}`}
                            >
                                {passwordsMatch ? (
                                    <>
                                        <CheckCircle2 className="h-3 w-3" />
                                        Les mots de passe correspondent
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-3 w-3" />
                                        Les mots de passe ne correspondent pas
                                    </>
                                )}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || success || !isPasswordStrong || !passwordsMatch}
                    >
                        {isLoading ? "Traitement en cours..." : buttonText}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

