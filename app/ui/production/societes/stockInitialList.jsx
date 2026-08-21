"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, RotateCcw, Search } from "lucide-react";
import { fetchData } from '@/app/_utils/api';
import PaginationControls from "@/components/ui/pagination-controls";
import { UserContext } from "@/app/ui/context/User_Context";
import { PlusCircle } from "lucide-react";
import { ROLES } from '@/lib/permissions';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExportButton from '@/components/ui/export_button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StockInitialEdit from './stockInitialEdit';
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
    const [exportBlob, setExportBlob] = useState(null);
    const [activedownloadBtn, setActivedownloadBtn] = useState(false);
    const [loadingEportBtn, setLoadingEportBtn] = useState(false);
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
                        usine: item?.stockage__usine__usine_name || "-",
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

    const handleExportStockInitial = async () => {
        setLoadingEportBtn(true);
        try {
            const initResponse = await fetchData("get", `cafe/prestockage_apres_usinage/get_list_quantite_initial/`, {
                params: { limit: 1 },
            });
            const total = initResponse?.count || 0;
            if (total === 0) {
                setLoadingEportBtn(false);
                return;
            }

            const response = await fetchData("get", `cafe/prestockage_apres_usinage/get_list_quantite_initial/`, {
                params: { limit: total },
            });

            const allData = response.results || [];
            const formattedData = allData.map((item) => {
                const row = {
                    numero_lot:
                        item.stockage__numero_lot,
                    Usine: item.stockage__usine__usine_name || "",
                    Proprietaire: item.stockage__proprietaire__nom_societe || "",
                    Qualite: item.stockage__qualite__nom || "",
                    Annee_Campagne: item?.annee_campagne || "",
                    Nombre_sacs: item?.nombre_sacs || "",
                    Quantite: item?.quantite_cafe_vert || "",
                };
                if (user?.session?.category === ROLES.ADMIN) {
                    row.CODE_USINE = item?.stockage__usine__usine_code || "";
                }
                return row;
            });

            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "STOCK_INITIAL");
            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });
            const blob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
            });

            setExportBlob(blob);
            setActivedownloadBtn(true);
        } catch (error) {
            console.error("Erreur exportation Excel :", error);
        } finally {
            setLoadingEportBtn(false);
        }
    };

    const DownloadStockInitialToExcel = () => {
        if (!exportBlob) return;
        const now = new Date();
        const date = now.toISOString().split("T")[0];
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const time = `${hours}_${minutes}_${seconds}`;
        saveAs(
            exportBlob,
            `stock_initial_${date}_${time}.xlsx`,
        );
        setActivedownloadBtn(false);
        setExportBlob(null);
    };



    return (
        <Card>
            <CardHeader>
                <CardTitle>Stock Initial</CardTitle>
                <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4 ">
                    <div className="relative ">
                        <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 " />
                        <Input
                            placeholder="Rechercher..."
                            // value={searchvalue}
                            // onChange={(e) => setSearchValue(e.target.value)}
                            className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
                        />
                    </div>

                    <div className="flex flex-row justify-between gap-x-3">


                        <div className="flex items-center gap-3 text-gray-700">
                            <ExportButton
                                handleExportStockInitial={handleExportStockInitial}
                                exportType="stock_initial_data"
                                loading={loadingEportBtn}
                                activedownloadBtn={activedownloadBtn}
                                onClickDownloadButton={DownloadStockInitialToExcel}
                            />
                        </div>

                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {user?.session?.category === "Admin" && (
                                <TableHead className="">Actions</TableHead>
                            )}
                            <TableHead className=""> #</TableHead>
                            <TableHead className="">Lot</TableHead>
                            <TableHead>Société</TableHead>
                            <TableHead>Usine</TableHead>
                            <TableHead className="">Qualités</TableHead>
                            <TableHead className="">Quantites</TableHead>
                            <TableHead className="">Nombre de sacs</TableHead>
                            <TableHead className="">Campagne</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lots?.map((lot, index) => (
                            <TableRow key={lot.id}>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuLabel className="text-muted-foreground font-normal">
                                                Actions
                                            </DropdownMenuLabel>

                                            {user?.session?.category === "Admin" && (
                                                <DropdownMenuItem onClick={() => handleEditClick(lot)} className="bg-secondary text-card flex  items-center justify-center cursor-pointer">

                                                    Modifier
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="font-medium">{lot.numero_lot}</TableCell>
                                <TableCell>{lot.societe}</TableCell>
                                <TableCell className="font-semibold">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-slate-800 dark:text-slate-200">
                                            {lot.usine || "-"}
                                        </span>
                                    </div>
                                </TableCell>
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
