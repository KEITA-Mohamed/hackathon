import './style.scss';
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
        <div className="table">
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((header, index) => (
                            <TableHead key={index}>
                                <Button
                                    variant="ghost"
                                    onClick={() => requestSort(index)}
                                    className=""
                                >
                                    {header}
                                    <ArrowUpDown className="" />
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
                                    <TableCell className='status-container'>
                                        {inviteStatuses[rowIndex]?.status === "success" ? (
                                            <span className="status success-status">
                                                <CheckCircle className="" />
                                                Succès
                                            </span>
                                        ) : inviteStatuses[rowIndex]?.status === "error" ? (
                                            <span className="status error-status">
                                                <AlertCircle className="" />
                                                Échec
                                            </span>
                                        ) : (
                                            <span className="status progress-status">En attente</span>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={headers.length + (showResults ? 1 : 0)} className="">
                                Aucun résultat trouvé.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}