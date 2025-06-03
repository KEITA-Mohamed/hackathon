"use client"

import { useState } from "react"
import type { UserData } from "@/types/invitation"
import { UserApiService } from "@/services/user-api"
import { InvitationHelpers } from "@/lib/invitation-helpers"

/**
 * Hook pour gérer l'envoi d'une seule invitation ou d'un lot d'invitations
 */
export function useInvitationSender() {
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    /**
     * Traite une invitation individuelle
     */
    const processSingleInvitation = async (user: UserData, index: number, onProgress: (processed: number) => void) => {
        try {
            const { lastName, firstName, email, role } = user

            const { response, responseData } = await UserApiService.sendInvitation({
                lastName,
                firstName,
                email,
                role,
            })

            onProgress(index + 1)

            if (response.status === 201) {
                return {
                    index,
                    email,
                    firstName,
                    lastName,
                    role,
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
                    firstName,
                    lastName,
                    role,
                    inviteStatus: "error" as const,
                    message: errorMessage,
                }
            }
        } catch (error) {
            console.error(`Exception pour ${user.email}:`, error)
            onProgress(index + 1)

            return {
                index,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                inviteStatus: "error" as const,
                message: error instanceof Error ? error.message : "Erreur inconnue",
            }
        }
    }

    /**
     * Envoie plusieurs invitations en parallèle
     */

    const sendBatchInvitations = async (
        userData: UserData[],
        onProgressUpdate?: (progress: number, processed: number, total: number) => void,
    ) => {
        setIsLoading(true)
        setProgress(0)

        let processed = 0
        const totalEmails = userData.length

        const invitePromises = userData.map((user, index) =>
            processSingleInvitation(user, index, (newProcessed) => {
                processed = newProcessed
                const progressPercent = InvitationHelpers.calculateProgress(processed, totalEmails)

                // Mise à jour du progrès local
                setProgress(progressPercent)

                // Notification au parent si callback fourni
                if (onProgressUpdate) {
                    onProgressUpdate(progressPercent, processed, totalEmails)
                }
            }),
        )

        const results = await Promise.allSettled(invitePromises)
        setIsLoading(false)

        return results
    }

    return {
        isLoading,
        progress,
        sendBatchInvitations,
        processSingleInvitation,
    }
}
