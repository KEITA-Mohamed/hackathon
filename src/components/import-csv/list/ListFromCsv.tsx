import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowUpDown, CheckCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";


type InviteStatus = {
    email: string
    status: "pending" | "success" | "error"
    message?: string
}


interface ListProps {
    headers: string[];
    requestSort: (index: number) => void;
    showResults: boolean;
    filteredData: string[][];
    inviteStatuses: InviteStatus[];
}

export default function ListFromCsv({
                                 headers,
                                 requestSort,
                                 showResults,
                                 filteredData,
                                 inviteStatuses
                             }: ListProps) {
    return (
        <div className="rounded-md border overflow-auto max-h-[400px]">
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((header, index) => (
                            <TableHead key={index}>
                                <Button
                                    variant="ghost"
                                    onClick={() => requestSort(index)}
                                    className="flex items-center gap-1 p-0 h-auto font-medium"
                                >
                                    {header}
                                    <ArrowUpDown className="h-4 w-4" />
                                </Button>
                            </TableHead>
                        ))}
                        {showResults && <TableHead>Statut</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.length > 0 ? (
                        filteredData.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <TableCell key={cellIndex}>{cell}</TableCell>
                                ))}
                                {showResults && (
                                    <TableCell>
                                        {inviteStatuses[rowIndex]?.status === "success" ? (
                                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Succès
                                            </Badge>
                                        ) : inviteStatuses[rowIndex]?.status === "error" ? (
                                            <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                Échec
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">En attente</Badge>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={headers.length + (showResults ? 1 : 0)} className="h-24 text-center">
                                Aucun résultat trouvé.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}