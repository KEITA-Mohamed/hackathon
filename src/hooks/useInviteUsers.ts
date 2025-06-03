"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { InviteStatus, InvitationResults } from "@/types/invitation"
import { InvitationHelpers } from "@/lib/invitation-helpers"
import { useInvitationSender } from "./useInvitationSender"
import { useInvitationCleanup } from "./useInvitationCleanup"

/**
 * Hook principal pour gérer l'envoi d'invitations en masse
 * Version simplifiée et mieux organisée
 */
export function useInviteUsers() {
    // États principaux
    const [inviteStatuses, setInviteStatuses] = useState<InviteStatus[]>([])
    const [showResults, setShowResults] = useState(false)
    const [results, setResults] = useState<InvitationResults | null>(null)

    // Hooks spécialisés
    const invitationSender = useInvitationSender()
    const invitationCleanup = useInvitationCleanup()

    /**
     * Fonction principale pour envoyer des invitations en masse
     */
    const sendInvitations = async (rawData: string[][]) => {
        if (invitationSender.isLoading || rawData.length === 0) {
            return { successCount: 0, errorCount: 0, totalEmails: 0, statuses: [] }
        }

        // Préparation
        const totalEmails = rawData.length
        const userData = InvitationHelpers.formatUserData(rawData)
        const initialStatuses = InvitationHelpers.createInitialStatuses(userData)

        setInviteStatuses(initialStatuses)
        setShowResults(false)

        toast.info("Envoi des invitations en cours", {
            description: `Envoi de ${totalEmails} invitations...`,
        })

        // Envoi des invitations
        const promiseResults = await invitationSender.sendBatchInvitations(userData)
        // Traitement des résultats
        const newStatuses = [...initialStatuses]
        promiseResults.forEach((result, resultIndex) => {
            if (result.status === "fulfilled") {
                const { index, email, firstName, lastName, role, inviteStatus, message } = result.value
                newStatuses[index] = {
                    email,
                    firstName,
                    lastName,
                    role,
                    status: inviteStatus,
                    message,
                }
            } else {
                // Gestion des erreurs de promesse
                newStatuses[resultIndex] = {
                    ...userData[resultIndex],
                    status: "error",
                    message: "Erreur inattendue lors du traitement",
                }
            }
        })

        setInviteStatuses([...newStatuses])

        // Nettoyage des erreurs
        const errorStatuses = InvitationHelpers.filterByStatus(newStatuses, "error")
        if (errorStatuses.length > 0) {
            await invitationCleanup.cleanupFailedInvitations(errorStatuses, () => {})
        }

        // Calcul des résultats finaux
        const successCount = InvitationHelpers.filterByStatus(newStatuses, "success").length
        const errorCount = InvitationHelpers.filterByStatus(newStatuses, "error").length

        // Notifications finales
        if (errorCount > 0) {
            toast.error("Envoi des invitations terminé", {
                description: `${successCount} succès, ${errorCount} échecs sur ${totalEmails} invitations`,
            })
        } else {
            toast.success("Envoi des invitations terminé", {
                description: `${successCount} invitations envoyées avec succès`,
            })
        }

        // Mise à jour des états finaux
        const finalResults = {
            successCount,
            errorCount,
            totalEmails,
            statuses: newStatuses,
        }

        setResults(finalResults)
        setShowResults(true)

        return finalResults
    }

    /**
     * Fonction pour renvoyer les invitations échouées
     */
    const retryFailedInvitations = async () => {
        if (invitationSender.isLoading || !results || results.errorCount === 0) {
            return { successCount: 0, errorCount: 0, totalEmails: 0, statuses: [] }
        }

        const failedInvitations = InvitationHelpers.filterByStatus(inviteStatuses, "error")
        const totalRetries = failedInvitations.length

        if (totalRetries === 0) {
            toast.info("Aucune invitation à renvoyer")
            return { successCount: 0, errorCount: 0, totalEmails: 0, statuses: [] }
        }

        toast.info("Renvoi des invitations échouées", {
            description: `Renvoi de ${totalRetries} invitations...`,
        })

        // Conversion des statuses échouées en UserData pour le renvoi
        const retryUserData = failedInvitations.map((status) => ({
            lastName: status.lastName,
            firstName: status.firstName,
            email: status.email,
            role: status.role,
        }))

        // Renvoi des invitations
        /*const retryResults = await invitationSender.sendBatchInvitations(retryUserData, (progress) => {
            // Progrès géré dans le sender
        })*/

        const retryResults = await invitationSender.sendBatchInvitations(retryUserData)

        // Mise à jour des statuts avec les nouveaux résultats
        const updatedStatuses = [...inviteStatuses]
        retryResults.forEach((result) => {
            if (result.status === "fulfilled") {
                const { email, firstName, lastName, role, inviteStatus, message } = result.value
                const statusIndex = updatedStatuses.findIndex((status) => status.email === email)

                if (statusIndex !== -1) {
                    updatedStatuses[statusIndex] = {
                        email,
                        firstName,
                        lastName,
                        role,
                        status: inviteStatus,
                        message,
                    }
                }
            }
        })

        setInviteStatuses(updatedStatuses)

        // Nettoyage final
        const stillFailedStatuses = InvitationHelpers.filterByStatus(updatedStatuses, "error")
        if (stillFailedStatuses.length > 0) {
            await invitationCleanup.cleanupFailedInvitations(stillFailedStatuses, () => {})
        }

        // Calcul des résultats du retry
        const retriedSuccessCount = retryResults.filter(
            (result) => result.status === "fulfilled" && result.value.inviteStatus === "success",
        ).length

        // Mise à jour des résultats globaux
        const newSuccessCount = InvitationHelpers.filterByStatus(updatedStatuses, "success").length
        const newErrorCount = InvitationHelpers.filterByStatus(updatedStatuses, "error").length

        const updatedResults = {
            successCount: newSuccessCount,
            errorCount: newErrorCount,
            totalEmails: results.totalEmails,
            statuses: updatedStatuses,
        }
        setResults(updatedResults)

        // Notification finale
        if (retriedSuccessCount > 0) {
            toast.success("Renvoi terminé", {
                description: `${retriedSuccessCount} invitations renvoyées avec succès sur ${totalRetries} tentatives`,
            })
        } else {
            toast.error("Renvoi terminé", {
                description: `Aucune invitation n'a pu être renvoyée avec succès`,
            })
        }

        return {
            successCount: retriedSuccessCount,
            errorCount: totalRetries - retriedSuccessCount,
            totalEmails: totalRetries,
            statuses: updatedStatuses.filter((status) => failedInvitations.some((failed) => failed.email === status.email)),
        }
    }

    return {
        // États
        isLoading: invitationSender.isLoading || invitationCleanup.isCleaningUp,
        progress: invitationSender.progress,
        inviteStatuses,
        showResults,
        results,

        // Actions
        sendInvitations,
        retryFailedInvitations,
        setInviteStatuses,
        setShowResults,
    }
}
