"use client"

import { useState } from "react"
import { toast } from "sonner"

/**
 * Type représentant le statut d'une invitation
 */
export type InviteStatus = {
    email: string
    status: "pending" | "success" | "error"
    message?: string
}

/**
 * Type représentant les données d'un utilisateur à inviter
 */
export type UserData = {
    lastName: string
    firstName: string
    email: string
    role: string
}

/**
 * Type pour les résultats d'invitation
 */
export type InvitationResults = {
    successCount: number
    errorCount: number
    totalEmails: number
    statuses: InviteStatus[]
}

/**
 * Hook pour gérer l'envoi d'invitations en masse aux utilisateurs
 *
 * @returns Un objet contenant les états et fonctions pour gérer les invitations
 */
export function useInviteUsers() {
    // États pour gérer le processus d'invitation
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [inviteStatuses, setInviteStatuses] = useState<InviteStatus[]>([])
    const [showResults, setShowResults] = useState(false)
    const [results, setResults] = useState<InvitationResults | null>(null)


    /**
     * Vérifie si un utilisateur existe dans la base de données
     *
     * @param email - L'email de l'utilisateur à vérifier
     * @returns Un booléen indiquant si l'utilisateur existe
     */
    const checkUserExists = async (email: string): Promise<boolean> => {
        try {
            const response = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })

            if (!response.ok) return false

            const data = await response.json()
            return data.exists === true
        } catch (error) {
            console.error("Erreur lors de la vérification de l'utilisateur:", error)
            return false
        }
    }

    /**
     * Convertit les données brutes du tableau en objets utilisateur
     *
     * @param rawData - Les données brutes du tableau [lastName, firstName, email, role][]
     * @returns Un tableau d'objets utilisateur
     */
    const formatUserData = (rawData: string[][]): UserData[] => {
        return rawData.map((row) => ({
            lastName: row[0],
            firstName: row[1],
            email: row[2],
            role: row[3]
        }))
    }

    /**
     * Fonction principale pour envoyer des invitations en masse
     *
     * @param rawData - Les données brutes du tableau [lastName, firstName, email, role][]
     * @returns Une promesse avec les résultats des invitations
     */
    const sendInvitations = async (rawData: string[][]) => {
        if (isLoading || rawData.length === 0) {
            return { successCount: 0, errorCount: 0, totalEmails: 0, statuses: [] }
        }


        setIsLoading(true)
        setProgress(0)
        setShowResults(false)

        const totalEmails = rawData.length
        const userData = formatUserData(rawData)


        const initialStatuses: InviteStatus[] = userData.map((user) => ({
            email: user.email,
            status: "pending",
        }))
        setInviteStatuses(initialStatuses)

        toast.info("Envoi des invitations en cours", {
            description: `Envoi de ${totalEmails} invitations...`,
        })


        let processed = 0


        const invitePromises = userData.map((user, index) => {
            return (async () => {
                try {
                    const { lastName, firstName, email, role } = user

                    // Effectuer la requête
                    const response = await fetch("/api/users/invite", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            lastName,
                            firstName,
                            email,
                            role,
                        }),
                    })

                    let responseData
                    try {
                        responseData = await response.json()
                    } catch (e) {
                        console.error(e)
                        responseData = { message: "Format de réponse invalide" }
                    }


                    processed++
                    const newProgress = Math.round((processed / totalEmails) * 100)
                    setProgress(newProgress)

                    if (response.status === 201) {
                        return {
                            index,
                            email,
                            inviteStatus: "success" as const,
                            message: responseData.message || "Invitation envoyée avec succès",
                        }
                    } else {
                        const errorMessage =
                            responseData.errors?.message || responseData.message || `Erreur ${response.status}: Échec de l'envoi`

                        console.error(`Erreur pour ${email}:`, {
                            status: response.status,
                            responseData,
                            errorMessage,
                        })

                        return {
                            index,
                            email,
                            inviteStatus: "error" as const,
                            message: errorMessage,
                        }
                    }
                } catch (error) {
                    const email = user.email
                    console.error(`Exception pour ${email}:`, error)

                    processed++
                    const newProgress = Math.round((processed / totalEmails) * 100)
                    setProgress(newProgress)

                    return {
                        index,
                        email,
                        inviteStatus: "error" as const,
                        message: error instanceof Error ? error.message : "Erreur inconnue",
                    }
                }
            })()
        })


        const promiseResults = await Promise.allSettled(invitePromises)

        // Traiter les résultats
        const newStatuses: InviteStatus[] = [...initialStatuses]

        // Première passe - traiter tous les résultats
        promiseResults.forEach((result, resultIndex) => {
            if (result.status === "fulfilled") {
                const { index, email, inviteStatus, message } = result.value
                newStatuses[index] = {
                    email,
                    status: inviteStatus,
                    message,
                }
            } else {
                // Ce cas ne devrait pas se produire car nous gérons les erreurs dans les promesses
                // Mais par sécurité, nous le traitons quand même
                const index = resultIndex
                newStatuses[index] = {
                    email: userData[index].email,
                    status: "error",
                    message: "Erreur inattendue lors du traitement",
                }
            }
        })

        // Mettre à jour les statuts pour montrer les résultats initiaux
        setInviteStatuses([...newStatuses])


        toast.info("Vérification des résultats...", {
            description: "Confirmation des statuts des utilisateurs",
        })

        const errorStatuses = newStatuses.filter((status) => status.status === "error")
        let correctedCount = 0

        for (let i = 0; i < errorStatuses.length; i++) {
            const status = errorStatuses[i]
            const email = status.email


            const exists = await checkUserExists(email)

            if (exists) {

                const index = newStatuses.findIndex((s) => s.email === email)
                if (index !== -1) {
                    newStatuses[index] = {
                        email,
                        status: "error",
                        message: "Utilisateur créé, mais l'envoi d'email a échoué",
                    }
                    correctedCount++
                }
            }


            const verificationProgress = Math.round(((i + 1) / errorStatuses.length) * 100)
            setProgress(verificationProgress)
        }

        // Mettre à jour tous les statuts après la vérification
        setInviteStatuses([...newStatuses])


        const successCount = newStatuses.filter((s) => s.status === "success").length
        const errorCount = newStatuses.filter((s) => s.status === "error").length


        if (correctedCount > 0) {
            toast.info("Statuts corrigés", {
                description: `${correctedCount} utilisateurs ont été créés mais l'envoi d'email a échoué`,
            })
        }

        if (errorCount > 0) {
            toast.error("Envoi des invitations terminé", {
                description: `${successCount} succès, ${errorCount} échecs sur ${totalEmails} invitations`,
            })
        } else {
            toast.success("Envoi des invitations terminé", {
                description: `${successCount} invitations envoyées avec succès`,
            })
        }


        setIsLoading(false)
        setShowResults(true)


        const finalResults = {
            successCount,
            errorCount,
            totalEmails,
            statuses: newStatuses,
        }
        setResults(finalResults)


        return finalResults
    }


    return {

        isLoading,
        progress,
        inviteStatuses,
        showResults,
        results,

        sendInvitations,

        setInviteStatuses,
        setShowResults,
    }
}
