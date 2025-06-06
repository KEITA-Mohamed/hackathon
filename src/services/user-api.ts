import type { CheckUserResult } from "@/types/invitation"

/**
 * Service pour les appels API liés aux utilisateurs
 */
export class UserApiService {
    /**
     * Vérifie si un utilisateur existe dans la base de données
     */
    static async checkUserExists(email: string): Promise<CheckUserResult> {
        try {
            const response = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })

            if (!response.ok) {
                throw new Error("Erreur lors de la vérification")
            }

            const data = await response.json()
            return data as CheckUserResult
        } catch (error) {
            console.error("Erreur lors de la vérification de l'utilisateur:", error)
            throw new Error("Erreur lors de la vérification")
        }
    }

    /**
     * Supprime un utilisateur par son ID
     */
    static async deleteUser(id: string): Promise<void> {
        try {
            const response = await fetch(`/api/users/delete?id=${encodeURIComponent(id)}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            })

            if (!response.ok) {
                throw new Error("Erreur lors de la suppression de l'utilisateur")
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur:", error)
            throw new Error("Erreur lors de la suppression de l'utilisateur")
        }
    }

    /**
     * Envoie une invitation à un utilisateur
     */
    static async sendInvitation(userData: {
        lastName: string
        firstName: string
        email: string
        role: string
    }) {
        const response = await fetch("/api/users/invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })

        let responseData
        try {
            responseData = await response.json()
        } catch (e) {
            console.error(e)
            responseData = { message: "Format de réponse invalide" }
        }

        return { response, responseData }
    }
}
