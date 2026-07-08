import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
export default function StockInitialList({ lots, onStartStocking }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Stock Initial</CardTitle>
                <CardDescription>
                    Voici la liste de tous les lots qui sont actuellement en stock.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">ID Lot</TableHead>
                            <TableHead>Société</TableHead>
                            <TableHead className="text-center">Qualités</TableHead>
                            <TableHead className="text-center">Quantites</TableHead>
                            <TableHead className="w-[120px]">Nombre de sacs</TableHead>
                            <TableHead className="text-center">Campagne</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lots
                            ?.filter((lot) => lot?.statut_stockage === "non_preleve")
                            ?.map((lot) => (
                                <TableRow key={lot.id}>
                                    <TableCell className="font-medium">{lot.numero_lot}</TableCell>
                                    <TableCell>{lot.societe?.nom || lot.proprietaire_nom}</TableCell>
                                    <TableCell className="font-medium">{lot.nombre_sacs}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {Object.entries(lot.details_qualite || {}).map(([qualite, nombre], index) => (
                                                <Badge key={index} variant="secondary" className="px-2 py-1 text-xs">
                                                    {qualite} : {nombre} sac{nombre !== 1 ? "s" : ""}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
