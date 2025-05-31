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
    errorCount: number;
    inviteStatuses: InviteStatus[];
}

export default function ErreurList({
                                       isErrorListOpen,
                                       setIsErrorListOpen,
                                       errorCount,
                                       inviteStatuses,
                                   }: ErreurListProps) {
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
                        onClick={() => {

                            const errorData = inviteStatuses
                                .filter((status) => status.status === "error")
                                .map((status) => `${status.email},${status.message}`)
                                .join("\n")

                            const csvContent = "Email,Message d'erreur\n" + errorData
                            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
                            const url = URL.createObjectURL(blob)
                            const link = document.createElement("a")
                            link.setAttribute("href", url)
                            link.setAttribute(
                                "download",
                                `erreurs_invitations_${new Date().toISOString().slice(0, 10)}.csv`,
                            )
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                        }}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
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
                                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                                    <div className="flex flex-col">
                                        <strong className="text-destructive">{status.email}</strong>
                                        <span className="text-muted-foreground text-xs">
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