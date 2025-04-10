"use client"
import './InviteForm.scss';
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import {useUser} from "@/hooks/useUser";


export default function InviteForm() {

    const { loading, user, isAdmin, isTeacher } = useUser();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
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


        if (!formData.firstName.trim()) {
            newErrors.firstName = "Le prénom est obligatoire"
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Le nom est obligatoire"
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim()) {
            newErrors.email = "L'email est obligatoire"
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Format d'email invalide"
        }


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
        console.log(formData)

        try {

            const response = await fetch("/api/users/invite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                setSubmitSuccess(true)
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    role: "",
                })

            } else {
                setErrors(data.errors || { form: "Une erreur est survenue" })
            }
        } catch (error) {
            console.error("Erreur lors de la soumission:", error)
            setErrors({ form: "Une erreur est survenue lors de la connexion au serveur" })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Chargement...</span>
            </div>
        );
    }


    if (!user) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Vous devez être connecté pour accéder à cette page.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className='main-container'>
            <header>
                <h1>Inviter un utilisateur</h1>
                {/* <p>Remplissez le formulaire pour inviter un nouvel utilisateur.</p> */}
            </header>

            {submitSuccess ? (
                <div>
                    <Alert className="bg-green-50 border-green-200">
                        <AlertDescription className="text-green-800">L&apos;invitation a été envoyée avec succès!</AlertDescription>
                    </Alert>
                    <div className="mt-4">
                        <button onClick={() => setSubmitSuccess(false)} className="w-full">
                            Envoyer une autre invitation
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-container">
                        {errors.form && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.form}</AlertDescription>
                            </Alert>
                        )}

                        <div className='name-container'>
                            <div className='field-container'>
                                <h2>Prénom</h2>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Entrez le prénom"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.firstName}
                                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                                />
                                {errors.firstName && (
                                    <p id="firstName-error" className="text-sm text-destructive mt-1">
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>
                            <div className='field-container'>
                                <h2>Nom</h2>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Entrez le nom"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.lastName}
                                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                                />
                                {errors.lastName && (
                                    <p id="lastName-error">
                                        {errors.lastName}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='field-container'>
                            <h2>Email</h2>
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

                        <div className='field-container'>
                            {isAdmin ? (
                                <>
                                <h2>Rôle</h2>
                                <Select onValueChange={handleRoleChange} value={formData.role}>
                                    <SelectTrigger
                                        id="role"
                                        aria-invalid={!!errors.role}
                                        aria-describedby={errors.role ? "role-error" : undefined}
                                    >
                                        <SelectValue placeholder="Sélectionnez un rôle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                                        <SelectItem value="TEACHER">TEACHER</SelectItem>
                                        <SelectItem value="STUDENT">STUDENT</SelectItem>
                                    </SelectContent>
                                </Select>
                                </>
                            ) :isTeacher ? (
                                <input
                                    type="hidden"
                                    name="role"
                                    value="STUDENT"
                                    readOnly

                                    ref={(input) => {
                                        if (input && formData.role !== "STUDENT") {
                                            setFormData(prev => ({ ...prev, role: "STUDENT" }));
                                        }
                                    }}
                                />
                            ) : null}
                            {errors.role && (
                                <p id="role-error">
                                    {errors.role}
                                </p>
                            )}
                        </div>
                    </div>

                    <footer>
                        <button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                "Inviter"
                            )}
                        </button>
                    </footer>
                </form>
            )}
        </div>
    )
}

