import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronDown, ChevronUp, Download } from 'lucide-react';

// Définition du type InviteStatus
type InviteStatus = {
    email: string
    status: "pending" | "success" | "error"
    message?: string
}

interface ErreurListProps {
    isErrorListOpen: boolean;
    setIsErrorListOpen: (open: boolean) => void;
    handleRetryFailedInvitations: () => void;
    handleExport: () => void;
    errorCount: number;
    inviteStatuses: InviteStatus[];
}

export default function ErreurList({isErrorListOpen, setIsErrorListOpen, errorCount, inviteStatuses, handleRetryFailedInvitations, handleExport}: ErreurListProps) {
    return (
        <Collapsible open={isErrorListOpen} onOpenChange={setIsErrorListOpen} className="mt-2">
            <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center p-0 h-auto">
                        <h4 className="text-sm font-medium">Détails des erreurs ({errorCount}):</h4>
                        {isErrorListOpen ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                    </Button>
                </CollapsibleTrigger>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 text-neutral-50"
                        onClick={handleExport}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                    </Button>
                    <Button onClick={handleRetryFailedInvitations} variant="outline" size="sm" className="bg-gray-700 text-neutral-50">
                        Réessayer
                    </Button>
                </div>
            </div>

            <CollapsibleContent>

                <div className="mt-2 border rounded-md">
                    <div className="max-h-[150px] overflow-y-auto">
                        {inviteStatuses
                            .filter((status) => status.status === "error")
                            .map((status, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-2 p-2 border-b last:border-b-0 hover:bg-muted/50"
                                >
                                    <AlertCircle className="bg-red-100 text-red-800 hover:bg-red-100 h-4 w-4 text-destructive shrink-0 mt-0.5" />
                                    <div className="flex flex-col">
                                        <strong className="text-destructive text-gray-800">{status.email}</strong>
                                        <span className="text-muted-foreground text-xs text-red-800">
                                            {status.message || "Erreur inconnue"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}