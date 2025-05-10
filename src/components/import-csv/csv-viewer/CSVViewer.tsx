"use client"

import { useState, useMemo } from "react";
import { Search, X, Mail, CheckCircle} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

    const { isLoading, progress, inviteStatuses, showResults, sendInvitations } = useInviteUsers()

    const handleInvite = async () => {
        await sendInvitations(data)
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
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Données CSV: {fileName}</span>
                    <Badge variant="outline" className="bg-gray-700 text-neutral-50">{filteredData.length} lignes</Badge>
                </CardTitle>
                <CardDescription>
                    Cliquez sur les en-têtes de colonne pour trier. Utilisez la barre de recherche pour filtrer les données.
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full"
                                onClick={() => setSearchTerm("")}
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Effacer la recherche</span>
                            </Button>
                        )}
                    </div>
                    <Button variant="default" className="bg-gray-700 text-neutral-50" onClick={handleInvite} disabled={isLoading || filteredData.length === 0}>
                        {isLoading ? (
                            <>
                                <Mail className="mr-2 h-4 w-4 animate-pulse" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Mail className="mr-2 h-4 w-4" />
                                Envoyer Invitations
                            </>
                        )}
                    </Button>
                </div>

                {isLoading && (
                    <div className="mt-4">
                        <div className="flex justify-between mb-1 text-sm">
                            <span>Progression</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                )}

                {showResults && (
                    <div className="mt-4 space-y-2">
                        <Alert variant={errorCount > 0 ? "destructive" : "default"}>
                            <CheckCircle className="h-4 w-4" />
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
            </CardHeader>
            <CardContent>
                <ListFromCsv headers={headers} requestSort={requestSort} showResults={showResults} filteredData={filteredData} inviteStatuses={inviteStatuses} />
            </CardContent>
        </Card>
    )
}
