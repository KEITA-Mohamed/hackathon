/**
 * Types pour le système d'invitation d'utilisateurs
 */

/** Statut d'une invitation individuelle */
export type InviteStatus = {
    email: string
    lastName: string
    firstName: string
    role: string
    status: "pending" | "success" | "error"
    message?: string
}

/** Données d'un utilisateur à inviter */
export type UserData = {
    lastName: string
    firstName: string
    email: string
    role: string
}

/** Résultats globaux des invitations */
export type InvitationResults = {
    successCount: number
    errorCount: number
    totalEmails: number
    statuses: InviteStatus[]
}

/** Résultat de vérification d'existence d'un utilisateur */
export type CheckUserResult = {
    exists: boolean
    id?: string
}
