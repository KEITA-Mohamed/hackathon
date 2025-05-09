"use client"

import type React from "react"
import { useState } from "react"
import { Upload, FileUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { parseCsv } from "@/lib/csv-parser"
import CsvViewer from "@/components/import-csv/csv-viewer/CSVViewer"

export default function ImportCSV() {
    const [csvData, setCsvData] = useState<string[][]>([])
    const [headers, setHeaders] = useState<string[]>([])
    const [fileName, setFileName] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        setError(null)

        if (!file) return

        if (!file.name.endsWith(".csv")) {
            setError("Veuillez télécharger un fichier CSV")
            return
        }

        setFileName(file.name)

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string
                const { data, headers } = parseCsv(text)
                setCsvData(data)
                setHeaders(headers)
            } catch (err) {
                setError("Echec de l'analyse du fichier CSV. Veuilez Vérifier le format.")
                console.error(err)
            }
        }

        reader.onerror = () => {
            setError("Échec de la lecture du fichier")
        }
        reader.readAsText(file)
    }

    return (

        <div className="h-full w-full overflow-y-auto pb-10">
            <div className="container mx-auto py-6 max-w-5xl">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 dark:bg-gray-900 mb-6">
                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                        <div className="flex h-6 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-medium">Télécharger un fichier CSV</h3>
                            <p className="text-sm text-muted-foreground">Glissez-déposez ou cliquez pour télécharger</p>
                        </div>
                        <input type="file" id="csv-upload" accept=".csv" onChange={handleFileUpload} className="hidden" />
                        <Button asChild>
                            <label htmlFor="csv-upload" className="cursor-pointer">
                                <FileUp className="mr-2 h-4 w-4" />
                                Sélectionner un fichier
                            </label>
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {csvData.length > 0 && (
                    <div className="w-full">
                        <CsvViewer data={csvData} headers={headers} fileName={fileName} />
                    </div>
                )}
            </div>
        </div>
    )
}
