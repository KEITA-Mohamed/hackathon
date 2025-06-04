"use client"

import "./CSVViewer.scss";
import { useState, useMemo } from "react";
import { CheckCircle} from "lucide-react";
// import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErreurList from "@/components/import-csv/erreur-list/ErreurList";
import ListFromCsv from "@/components/import-csv/list/ListFromCsv";
import { useInviteUsers } from "@/hooks/useInviteUsers"

interface CsvViewerProps {
    data: string[][]
    headers: string[]
    fileName: string
}


export default function CsvViewer({ data, headers, fileName }: CsvViewerProps) {
    const [sortConfig, setSortConfig] = useState<{
        key: number
        direction: "ascending" | "descending"
    } | null>(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [isErrorListOpen, setIsErrorListOpen] = useState(true)

    const { isLoading, progress, inviteStatuses, showResults, sendInvitations, retryFailedInvitations } = useInviteUsers()

    const handleInvite = async () => {
        await sendInvitations(data)
    }

    const handleRetryFailedInvitations = async () => {

        await retryFailedInvitations();
    }

    const handleExport = async (): Promise<void> => {

        const errorData = inviteStatuses
            .filter((status) => status.status === "error")
            .map((status) => `${status.email},${status.message}`)
            .join("\n")

        const csvContent = "Email,Message d'erreur\n" + errorData
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `erreurs_invitations_${new Date().toISOString().slice(0, 10)}.csv`,)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Trier les données en fonction de la configuration de tri actuelle
    const sortedData = useMemo(() => {
        const sortableData = [...data]
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                const aValue = a[sortConfig.key] || ""
                const bValue = b[sortConfig.key] || ""

                // Essayer de trier numériquement si possible
                const aNum = Number(aValue)
                const bNum = Number(bValue)

                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return sortConfig.direction === "ascending" ? aNum - bNum : bNum - aNum
                }

                // Sinon trier alphabétiquement
                return sortConfig.direction === "ascending" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            })
        }
        return sortableData
    }, [data, sortConfig])

    // Filtrer les données en fonction du terme de recherche
    const filteredData = useMemo(() => {
        if (!searchTerm) return sortedData

        return sortedData.filter((row) => row.some((cell) => cell.toLowerCase().includes(searchTerm.toLowerCase())))
    }, [sortedData, searchTerm])

    const requestSort = (key: number) => {
        let direction: "ascending" | "descending" = "ascending"

        if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending"
        }

        setSortConfig({ key, direction })
    }

    // Statistiques des résultats
    const successCount = inviteStatuses.filter((status) => status.status === "success").length
    const errorCount = inviteStatuses.filter((status) => status.status === "error").length

    return (
        <div className="csv-container">
            <header>
                <h1 className="">
                    <p>
                        File: <span>{fileName}</span>
                    </p>
                    <p>
                        {filteredData.length} lignes
                    </p>
                </h1>
                {/* <p>
                    Cliquez sur les en-têtes de colonne pour trier. Utilisez la barre de recherche pour filtrer les données.
                </p> */}
                <div className="input-container">
                    {/* <Search className="" /> */}
                    <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className=""
                    />
                    {searchTerm && (
                        <button
                            className="clear-search"
                            onClick={() => setSearchTerm("")}
                        >
                            <X className="" />
                            <span className="sr-only">Effacer la recherche</span>
                        </button>
                    )}
                </div>                    

                {isLoading && (
                    <div className="progress-container">
                        <Progress value={progress} className="progress" />
                        <div className="progress-counter-container">
                            {/* <span>Progression</span> */}
                            <span>{progress}%</span>
                        </div>
                    </div>
                )}                
            </header>
            <ListFromCsv headers={headers} requestSort={requestSort} showResults={showResults} filteredData={filteredData} inviteStatuses={inviteStatuses} />   
            {showResults && (
                <div className="result-container">
                    <Alert className="result-alert" variant={errorCount > 0 ? "destructive" : "default"}>
                        <CheckCircle className="" />
                        <AlertTitle>Résultat de l&apos;envoi des invitations</AlertTitle>
                        <AlertDescription className="">
                            {successCount} invitations envoyées avec succès, {errorCount} échecs sur {inviteStatuses.length}{" "}
                            tentatives.
                        </AlertDescription>
                    </Alert>

                    {errorCount > 0 && (
                        <ErreurList
                            isErrorListOpen={isErrorListOpen}
                            setIsErrorListOpen={setIsErrorListOpen}
                            errorCount={errorCount}
                            inviteStatuses={inviteStatuses}
                            handleRetryFailedInvitations={handleRetryFailedInvitations}
                            handleExport={handleExport}
                            />
                    )}
                </div>
            )}         
            <button className="send-invite" onClick={handleInvite} disabled={isLoading || filteredData.length === 0}>
                {isLoading ? (
                    <>
                        {/* <Mail className="" /> */}
                        Envoi en cours...
                    </>
                ) : (
                    <>
                        {/* <Mail className="" /> */}
                        Envoyer les invitations
                    </>
                )}
            </button>
        </div>
    )
}
