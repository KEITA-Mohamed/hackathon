"use client"

import './importCSV.scss';
import type React from "react"
import { useState } from "react"
import { FileUp, AlertCircle } from "lucide-react"
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
        <div className="main-container">
            <header>
                <h1>Importer un fichier CSV</h1>
            </header>
            <div className="load-container">               

                <input type="file" id="csv-upload" accept=".csv" onChange={handleFileUpload} className="hidden" />

                <Button className='csv-button' asChild>
                    <label htmlFor="csv-upload" className="cursor-pointer">
                        <FileUp className="" />
                        Sélectionner un fichier
                    </label>
                </Button>
                
                <p className="">Glissez-déposez ou cliquez pour télécharger</p>
                
            </div>

            {error && (
                <Alert variant="destructive" className="">
                    <AlertCircle className="" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {csvData.length > 0 && (
                <div className="">
                    <CsvViewer data={csvData} headers={headers} fileName={fileName} />
                </div>
            )}
            {/* <CsvViewer data={csvData} headers={headers} fileName={fileName} /> */}
        </div>
    )
}
