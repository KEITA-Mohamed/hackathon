"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { InviteStatus } from "@/types/invitation"
import { UserApiService } from "@/services/user-api"
import { InvitationHelpers } from "@/lib/invitation-helpers"

/**
 * Hook pour gérer le nettoyage des utilisateurs créés sans email envoyé
 */
export function useInvitationCleanup() {
    const [isCleaningUp, setIsCleaningUp] = useState(false)

    /**
     * Vérifie et nettoie les utilisateurs créés sans email envoyé
     */

    const cleanupFailedInvitations = async (
        errorStatuses: InviteStatus[],
        onProgress?: (progress: number) => void, // Rendre optionnel avec ?
    ): Promise<{ cleanedCount: number; updatedStatuses: InviteStatus[] }> => {
        setIsCleaningUp(true)

        toast.info("Vérification des résultats...", {
            description: "Confirmation des statuts des utilisateurs",
        })

        let cleanedCount = 0
        const updatedStatuses = [...errorStatuses]

        for (let i = 0; i < errorStatuses.length; i++) {
            const status = errorStatuses[i]
            const { email, firstName, lastName, role } = status

            try {
                const { exists, id } = await UserApiService.checkUserExists(email)

                if (exists && id) {
                    await UserApiService.deleteUser(id)

                    // Mettre à jour le statut
                    updatedStatuses[i] = {
                        email,
                        firstName,
                        lastName,
                        role,
                        status: "error",
                        message: "Utilisateur créé mais email non envoyé (nettoyé)",
                    }
                    cleanedCount++
                }
            } catch (error) {
                console.error(`Erreur lors du nettoyage pour ${email}:`, error)
            }

            const progressPercent = InvitationHelpers.calculateProgress(i + 1, errorStatuses.length)
            if (onProgress) {
                onProgress(progressPercent)
            }
        }

        setIsCleaningUp(false)

        if (cleanedCount > 0) {
            toast.info("Nettoyage terminé", {
                description: `${cleanedCount} utilisateurs créés sans email ont été supprimés`,
            })
        }

        return { cleanedCount, updatedStatuses }
    }

    return {
        isCleaningUp,
        cleanupFailedInvitations,
    }
}
