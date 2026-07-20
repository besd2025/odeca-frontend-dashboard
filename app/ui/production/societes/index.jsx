
"use client";
import PaginationContent from "@/components/ui/pagination-content";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React, { useState, useEffect, useCallback } from "react";
import { fetchData } from "@/app/_utils/api";

export default function SocietesQty() {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [pointer, setPointer] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ── Fetch avec pagination côté API ── */
    const loadData = useCallback(async (page, pageLimit) => {
        //setLoading(true);
        try {
            const offset = (page - 1) * pageLimit;
            const response = await fetchData('get', 'cafe/stock_cafe/societe-stock-stats-detail/', {
                params: { limit: pageLimit, offset },
            });
            setData(response?.results || []);
            setTotalCount(response?.count ?? 0);
        } catch (err) {
            console.error("Erreur chargement sociétés :", err);
        } finally {
            setLoading(false);
        }
    }, []);

    /* Déclencher le fetch à chaque changement de page ou de limit */
    useEffect(() => {
        loadData(currentPage, limit);
    }, [currentPage, limit, loadData]);

    /* ── Handlers de pagination ── */
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setPointer((pageNumber - 1) * limit);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPointer(0);
        setCurrentPage(1);
    };

    return (
        <div className="w-full bg-card p-4 rounded-lg border">

            <div className="w-full overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-4">ID</TableHead>
                            <TableHead>Société</TableHead>
                            <TableHead className="text-right">Café Parché (Kg)</TableHead>
                            <TableHead className="text-right">Nombre de sacs</TableHead>
                            <TableHead className="text-right">Pourcentage</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Chargement…
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Aucune donnée disponible.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((product) => (
                                <TableRow className="odd:bg-muted/50" key={product.societe_id ?? product.id}>
                                    <TableCell className="pl-4">{product.societe_id ?? product.id}</TableCell>
                                    <TableCell className="font-medium">{product.societe}</TableCell>
                                    <TableCell className="text-right">{(product.quantite_entree ?? 0).toLocaleString("fr-FR")}</TableCell>
                                    <TableCell className="text-right">{(product.sacs_total ?? product.nombre_sacs ?? 0).toLocaleString("fr-FR")}</TableCell>
                                    <TableCell className="text-right">{product.pourcentage ?? 0}%</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {totalCount > 0 && (
                        <span>
                            {pointer + 1}–{Math.min(pointer + limit, totalCount)} sur {totalCount} société(s)
                        </span>
                    )}
                </div>
                <PaginationContent
                    datapaginationlimit={() => { }}
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalCount / limit)}
                    onPageChange={handlePageChange}
                    pointer={pointer}
                    totalCount={totalCount}
                    onLimitChange={handleLimitChange}
                />
            </div>
        </div>
    );
}
