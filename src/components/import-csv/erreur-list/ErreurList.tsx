import './style.scss';
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
        <Collapsible open={isErrorListOpen} onOpenChange={setIsErrorListOpen} className="">
            <div className="error-header">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="">
                        <h4 className="">Détails des erreurs ({errorCount}):</h4>
                        {isErrorListOpen ? (
                            <ChevronUp className="" />
                        ) : (
                            <ChevronDown className="" />
                        )}
                    </Button>
                </CollapsibleTrigger>
                <div className="">
                    <Button
                        className='export-button'
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
                        <Download className="" />
                        Exporter
                    </Button>
                </div>
            </div>

            <CollapsibleContent>
                <div className="error-list-container">
                        {inviteStatuses
                            .filter((status) => status.status === "error")
                            .map((status, index) => (
                                <div
                                    key={index}
                                    className="error-item"
                                >
                                    <AlertCircle className="" />
                                    <div className="">
                                        <strong className="">{status.email}</strong>
                                        <span className="">
                                            {status.message || "Erreur inconnue"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}