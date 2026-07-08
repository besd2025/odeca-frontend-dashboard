"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { fetchData } from '@/app/_utils/api';
import PaginationControls from "@/components/ui/pagination-controls";

export default function StockInitialList({ onStartStocking }) {
    const [lots, setLots] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pointer, setPointer] = useState(0);
    const [search, setSearch] = useState("");

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setPointer((pageNumber - 1) * limit);
    };

    const onLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPointer(0);
        setCurrentPage(1);
    };

    React.useEffect(() => {
        const fetchLots = async () => {
            try {
                const lotsData = await fetchData("get", `cafe/prestockage_apres_usinage/get_list_quantite_initial/`, {
                    params: { limit, offset: pointer }
                });

                const formattedLots = lotsData?.results?.map(item => {

                    return {
                        id: item?.id,
                        numero_lot: item?.stockage__numero_lot,
                        societe: item?.stockage__proprietaire__nom_societe,
                        qualite: item?.stockage__qualite__nom,
                        annee_campagne: item?.annee_campagne,
                        nombre_sacs: item?.nombre_sacs,
                        quantite: item?.quantite_cafe_vert,
                    };
                });
                setLots(formattedLots || []);
                setTotalCount(lotsData?.count || 0);
            } catch (error) {
                console.error("Error fetching lots:", error);
            }
        };

        fetchLots();
    }, [limit, pointer]);
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
                            <TableHead className="w-[120px]"> #</TableHead>
                            <TableHead className="w-[120px]">Lot</TableHead>
                            <TableHead>Société</TableHead>
                            <TableHead className="text-center">Qualités</TableHead>
                            <TableHead className="text-center">Quantites</TableHead>
                            <TableHead className="w-[120px]">Nombre de sacs</TableHead>
                            <TableHead className="text-center">Campagne</TableHead>
                            {/* <TableHead className="text-right">Actions</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lots?.map((lot, index) => (
                            <TableRow key={lot.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="font-medium">{lot.numero_lot}</TableCell>
                                <TableCell>{lot.societe}</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-wrap justify-center gap-2">
                                        <Badge variant="secondary" className="px-2 py-1 text-xs">
                                            {lot.qualite}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{lot.quantite}</TableCell>
                                <TableCell className="font-medium">{lot.nombre_sacs}</TableCell>
                                <TableCell>{lot.annee_campagne}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <PaginationControls
                    className="mt-4"
                    page={currentPage}
                    pageSize={limit}
                    totalItems={totalCount}
                    totalPages={Math.ceil(totalCount / limit)}
                    onPageChange={onPageChange}
                    onPageSizeChange={onLimitChange}
                    hasNextPage={currentPage < Math.ceil(totalCount / limit)}
                    hasPreviousPage={currentPage > 1}
                />
            </CardContent>
        </Card>
    )
}
