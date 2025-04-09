"use client"

import './SignupForm.scss';
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"


export default function FormulaireInscription() {
    const [formData, setFormData] = useState({
        prenom: "",
        nom: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))


        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleRoleChange = (value: string) => {
        setFormData((prev) => ({ ...prev, role: value }))
        if (errors.role) {
            setErrors((prev) => ({ ...prev, role: "" }))
        }
    }



    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Format d'email invalide"
        }

        // Validate password strength (minimum 8 characters with at least one number)
        if (formData.password.length < 8) {
            newErrors.password = "Le mot de passe doit contenir au moins 8 caractères"
        } else if (!/\d/.test(formData.password)) {
            newErrors.password = "Le mot de passe doit contenir au moins un chiffre"
        }

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
        }

        // Validate role selection
        if (!formData.role) {
            newErrors.role = "Veuillez sélectionner un rôle"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
                  return
        }

        setIsSubmitting(true)

        try {

            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitSuccess(true);
                setFormData({
                    prenom: "",
                    nom: "",
                    email: "",
                    role: "",
                    password: "",
                    confirmPassword: "",
                });
            } else {
                setErrors(data.errors);
            }
        } catch (error) {
            console.error("Erreur lors de la soumission:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="connexion-container">
            <header>
                <p>Inscription
                    {/* <span>Créez votre compte en remplissant le formulaire ci-dessous.</span> */}
                </p>
            </header>

            {submitSuccess ? (
                <div>
                    <Alert className="bg-green-50 border-green-200">
                        <AlertDescription className="text-green-800">
                            Votre compte a été créé avec succès! Vous pouvez maintenant vous connecter.
                        </AlertDescription>
                    </Alert>
                    <div>
                        <button onClick={() => setSubmitSuccess(false)}>
                            Créer un autre compte
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className='form-main-container'>
                        <div className='name-container'>
                            <div className='form-field-container'>
                                <p>Prénom</p>
                                <input
                                    id="prenom"
                                    name="prenom"
                                    placeholder="Entrez votre prénom"
                                    value={formData.prenom}
                                    onChange={handleChange}

                                    aria-invalid={!!errors.prenom}
                                    aria-describedby={errors.prenom ? "prenom-error" : undefined}
                                />
                                {errors.prenom && (
                                    <p id="prenom-error">
                                        {errors.prenom}
                                    </p>
                                )}
                            </div>
                            <div className='form-field-container'>
                                <p>Nom</p>
                                <input
                                    id="nom"
                                    name="nom"
                                    placeholder="Entrez votre nom"
                                    value={formData.nom}
                                    onChange={handleChange}

                                    aria-invalid={!!errors.nom}
                                    aria-describedby={errors.nom ? "nom-error" : undefined}
                                />
                                {errors.nom && (
                                    <p id="nom-error">
                                        {errors.nom}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='form-field-container'>
                            <p>Email</p>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="exemple@email.com"
                                value={formData.email}
                                onChange={handleChange}

                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "email-error" : undefined}
                            />
                            {errors.email && (
                                <p id="email-error">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className='form-field-container'>
                            <p>Mot de passe</p>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Entrez votre mot de passe"
                                value={formData.password}
                                onChange={handleChange}

                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? "password-error" : undefined}
                            />
                            {errors.password && (
                                <p id="password-error">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className='form-field-container'>
                            <p>Confirmer le mot de passe</p>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirmez votre mot de passe"
                                value={formData.confirmPassword}
                                onChange={handleChange}

                                aria-invalid={!!errors.confirmPassword}
                                aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                            />
                            {errors.confirmPassword && (
                                <p id="confirm-password-error">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <div className='form-field-container'>
                            <p>Rôle</p>
                            <Select onValueChange={handleRoleChange} value={formData.role}>
                                <SelectTrigger
                                    id="role"
                                    aria-invalid={!!errors.role}
                                    aria-describedby={errors.role ? "role-error" : undefined}
                                >
                                    <SelectValue placeholder="Sélectionnez un rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="TEACHER">Teacher</SelectItem>
                                    <SelectItem value="STUDENT">Student</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <p id="role-error">
                                    {errors.role}
                                </p>
                            )}
                        </div>
                    </div>

                    <footer>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Traitement en cours...
                                </>
                            ) : (
                                "S'inscrire"
                            )}
                        </button>
                    </footer>
                </form>
            )}
        </div>
    )
}

