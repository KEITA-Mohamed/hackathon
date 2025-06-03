"use client"

import "./CSVViewer.scss";
import { useState, useMemo } from "react";
import { Search, X, Mail, CheckCircle} from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ErreurList from "@/components/import-csv/erreur-list/ErreurList";
import ListFromCsv from "@/components/import-csv/list/ListFromCsv";
import { createHandleInvite } from "@/lib/handle-invite";

interface CsvViewerProps {
    data: string[][]
    headers: string[]
    fileName: string
}

type InviteStatus = {
    email: string
    status: "pending" | "success" | "error"
    message?: string
}

export default function CsvViewer({ data, headers, fileName }: CsvViewerProps) {
    const [sortConfig, setSortConfig] = useState<{
        key: number
        direction: "ascending" | "descending"
    } | null>(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [inviteStatuses, setInviteStatuses] = useState<InviteStatus[]>([])
    const [showResults, setShowResults] = useState(false)
    const [isErrorListOpen, setIsErrorListOpen] = useState(true)

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

    const handleInvite = createHandleInvite({
        isLoading,
        setIsLoading,
        setProgress,
        setInviteStatuses,
        setShowResults,
        filteredData,
    });

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
                    <div className="">
                        <div className="">
                            <span>Progression</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="bg-red" />
                    </div>
                )}                
            </header>
            <ListFromCsv headers={headers} requestSort={requestSort} showResults={showResults} filteredData={filteredData} inviteStatuses={inviteStatuses} />   
            {showResults && (
                <div className="result-container">
                    <Alert className="result-alert" variant={errorCount > 0 ? "destructive" : "default"}>
                        <CheckCircle className="" />
                        <AlertTitle>Résultat de l&apos;envoi des invitations</AlertTitle>
                        <AlertDescription>
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
