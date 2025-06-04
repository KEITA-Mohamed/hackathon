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
    handleRetryFailedInvitations: () => void;
    handleExport: () => void;
    errorCount: number;
    inviteStatuses: InviteStatus[];
}

export default function ErreurList({isErrorListOpen, setIsErrorListOpen, errorCount, inviteStatuses, handleRetryFailedInvitations, handleExport}: ErreurListProps) {
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
                        className="bg-gray-700 text-neutral-50"
                        onClick={handleExport}
                    >
                        <Download className="" />
                        Exporter
                    </Button>
                    <Button onClick={handleRetryFailedInvitations} variant="outline" size="sm" className="bg-gray-700 text-neutral-50">
                        Réessayer
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