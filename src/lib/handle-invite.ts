import { toast } from "sonner";


type InviteStatus = {
    email: string;
    status: "pending" | "success" | "error";
    message?: string;
};

interface HandleInviteParams {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    setProgress: (progress: number) => void;
    setInviteStatuses: (statuses: InviteStatus[] | ((prev: InviteStatus[]) => InviteStatus[])) => void;
    setShowResults: (show: boolean) => void;
    filteredData: string[][];
}

/**
 * Gère l'envoi des invitations aux utilisateurs
 */
export const createHandleInvite = ({
                                       isLoading,
                                       setIsLoading,
                                       setProgress,
                                       setInviteStatuses,
                                       setShowResults,
                                       filteredData,
                                   }: HandleInviteParams) => {
    return async () => {
        if (isLoading) return;

        setIsLoading(true);
        setProgress(0);
        setInviteStatuses([]);
        setShowResults(false);

        const totalEmails = filteredData.length;
        let processed = 0;
        let successCount = 0;
        let errorCount = 0;

        const initialStatuses = filteredData.map((row) => ({
            email: row[2],
            status: "pending" as const,
        }));
        setInviteStatuses(initialStatuses);


        toast.info("Envoi des invitations en cours", {
            description: `Envoi de ${totalEmails} invitations...`,
        });

        // Traiter les emails un par un pour un meilleur suivi
        for (let i = 0; i < filteredData.length; i++) {
            const row = filteredData[i];

            try {
                const response = await fetch("/api/users/invite", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        lastName: row[0],
                        firstName: row[1],
                        email: row[2],
                        role: row[3],
                    }),
                });

                const responseData = await response.json();
                processed++;

                // Mettre à jour le statut de cet email
                setInviteStatuses((prev) => {
                    const newStatuses = [...prev];
                    if (response.ok) {
                        newStatuses[i] = {
                            email: row[2],
                            status: "success",
                            message: "Invitation envoyée avec succès",
                        };
                        successCount++;
                    } else {

                        const errorMessage =
                            responseData.errors?.message || responseData.message || `Erreur ${response.status}: Échec de l'envoi`;

                        newStatuses[i] = {
                            email: row[2],
                            status: "error",
                            message: errorMessage,
                        };
                        errorCount++;


                        if (response.status === 400) {

                            toast.error(`Erreur pour ${row[2]}`, {
                                description: errorMessage,
                            });
                        }
                    }
                    return newStatuses;
                });

                // Mettre à jour la progression
                const newProgress = Math.round((processed / totalEmails) * 100);
                setProgress(newProgress);
            } catch (error) {
                processed++;
                errorCount++;


                setInviteStatuses((prev) => {
                    const newStatuses = [...prev];
                    newStatuses[i] = {
                        email: row[2],
                        status: "error",
                        message: error instanceof Error ? error.message : "Erreur inconnue",
                    };
                    return newStatuses;
                });

                // Mettre à jour la progression même en cas d'erreur
                const newProgress = Math.round((processed / totalEmails) * 100);
                setProgress(newProgress);
            }
        }


        if (errorCount > 0) {
            toast.error("Envoi des invitations terminé", {
                description: `${successCount} succès, ${errorCount} échecs sur ${totalEmails} invitations`,
            });
        } else {
            toast.success("Envoi des invitations terminé", {
                description: `${successCount} invitations envoyées avec succès`,
            });
        }

        setIsLoading(false);
        setShowResults(true);
    };
};