import type { UserData, InviteStatus } from "@/types/invitation"

/**
 * Utilitaires pour le traitement des invitations
 */
export class InvitationHelpers {
    /**
     * Convertit les données brutes du tableau en objets utilisateur
     * @param rawData - Tableau de [lastName, firstName, email, role]
     */
    static formatUserData(rawData: string[][]): UserData[] {
        return rawData.map((row) => ({
            lastName: row[0],
            firstName: row[1],
            email: row[2],
            role: row[3],
        }))
    }

    /**
     * Crée les statuts initiaux pour les invitations
     */
    static createInitialStatuses(userData: UserData[]): InviteStatus[] {
        return userData.map((user) => ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: "pending",
        }))
    }

    /**
     * Calcule le pourcentage de progression
     */
    static calculateProgress(processed: number, total: number): number {
        return Math.round((processed / total) * 100)
    }

    /**
     * Filtre les invitations par statut
     */
    static filterByStatus(statuses: InviteStatus[], status: InviteStatus["status"]): InviteStatus[] {
        return statuses.filter((s) => s.status === status)
    }
}
