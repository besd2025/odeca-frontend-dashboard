"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, RotateCcw } from "lucide-react";
import { fetchData } from '@/app/_utils/api';
import PaginationControls from "@/components/ui/pagination-controls";
import { UserContext } from "@/app/ui/context/User_Context";
import StockInitialEdit from "./stockInitialEdit";
export default function StockInitialList({ onStartStocking }) {
    const [lots, setLots] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pointer, setPointer] = useState(0);
    const [search, setSearch] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const user = React.useContext(UserContext);

    const handleEditClick = (lot) => {
        setSelectedStock(lot);
        setEditOpen(true);
    };

    const handleEditSuccess = () => {
        // Rafraîchir la liste après une modification réussie
        setRefreshKey((prev) => prev + 1);
    };
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
                console.log("lotsData", lotsData);
                const formattedLots = lotsData?.results?.map(item => {

                    return {
                        id: item?.id,
                        numero_lot: item?.stockage__numero_lot,
                        societe: item?.stockage__proprietaire__nom_societe,
                        qualite: item?.stockage__qualite__nom,
                        annee_campagne: item?.annee_campagne,
                        nombre_sacs: item?.nombre_sacs,
                        quantite: item?.quantite_cafe_vert,
                        qualite_id: item?.stockage__qualite__id,
                        proprietaire_id: item?.stockage__proprietaire__id,
                    };
                });
                setLots(formattedLots || []);
                setTotalCount(lotsData?.count || 0);
            } catch (error) {
                console.error("Error fetching lots:", error);
            }
        };

        fetchLots();
    }, [limit, pointer, refreshKey]);
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
                            {user?.session?.category === "Admin" && (
                                <TableHead className="text-right">Actions</TableHead>
                            )}
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
                                {user?.session?.category === "Admin" && (
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditClick(lot)}
                                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                            title="Modifier ce stock"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                )}
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

            {/* Dialog de modification */}
            <StockInitialEdit
                open={editOpen}
                onOpenChange={setEditOpen}
                stockItem={selectedStock}
                onSuccess={handleEditSuccess}
            />
        </Card>
    )
}
