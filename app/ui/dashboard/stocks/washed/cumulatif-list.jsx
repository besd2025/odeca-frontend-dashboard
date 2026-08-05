"use client";

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDownIcon, Building2, Search, TrendingUp } from "lucide-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TableRowsSkeleton } from "@/components/ui/skeletons";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ExportButton from "@/components/ui/export_button";
import { Badge } from "@/components/ui/badge";
import PaginationContent from "@/components/ui/pagination-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const XLSX = require("xlsx");
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { fetchData } from "@/app/_utils/api";
// MockData pour le total cumulatif des quantités collectées par société (Café Washed)
// TODO API: Remplacer MOCK_CUMULATIF_WASHED par un appel API à fetchData("get", "cafe/cumulatif_washed/")
const MOCK_CUMULATIF_WASHED = [
    {
        id: "SOC-001",
        societe: "SODEICO SARL",
        total_quantite_washed: 45800,
        qualite: [{ label: "Qualité A", quantite: 23000 }, { label: "Qualité B", quantite: 22800 }],
        nb_achats: 32,
    },
    {
        id: "SOC-002",
        societe: "COPROTRAC",
        total_quantite_washed: 38400,
        qualite: [{ label: "Fully Washed", quantite: 38400 }],
        nb_achats: 27,
    },
];

export default function CumulatifWashedListTable({ isLoading: externalLoading }) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [data, setData] = React.useState({});
    const [loading, setLoading] = React.useState(true);

    const [limit, setLimit] = useState(5);
    const [pointer, setPointer] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const [loadingExportBtn, setLoadingExportBtn] = useState(false);
    const [activeDownloadBtn, setActiveDownloadBtn] = useState(false);
    const [exportBlob, setExportBlob] = useState(null);

    const isActuallyLoading = externalLoading ?? loading;
    React.useEffect(() => {
        const getAchats = async () => {
            setLoading(true);
            try {
                const QtesWashed = await fetchData("get", "cafe/achat_cafe_parche/total_quantite", {
                    params: {},
                    additionalHeaders: {}
                });
                const Nombre_Societe = await fetchData("get", "cafe/achat_cafe_parche/get_nombre_socites", {
                    params: {},
                    additionalHeaders: {}
                });
                const Nombre_Achats = await fetchData("get", "cafe/achat_cafe_parche/get_nombre_achat", {
                    params: {},
                    additionalHeaders: {}
                });
                console.log("newData: ", QtesWashed);
                console.log("newData: ", Nombre_Achats);
                const newData =
                {
                    total_societe: Nombre_Societe?.total_societe,
                    total_quantite_washed: QtesWashed?.total_quantite,
                    nb_achats: Nombre_Achats?.total_achat,
                };
                setData(newData);
            } catch (error) {
                console.error("Error fetching individual achats:", error);
            } finally {
                setLoading(false);
            }
        };

        getAchats();
    }, []);
    useEffect(() => {
        const getCumulatifData = async () => {
            setLoading(true);
            try {
                let filtered = [...MOCK_CUMULATIF_WASHED];
                if (search) {
                    const q = search.toLowerCase();
                    filtered = filtered.filter(
                        (item) =>
                            item.societe.toLowerCase().includes(q) ||
                            item.qualite.toLowerCase().includes(q) ||
                            item.id.toLowerCase().includes(q)
                    );
                }

                setTotalCount(filtered.length);
                const paginated = filtered.slice(pointer, pointer + limit);
                setData(paginated);
            } catch (error) {
                console.error("Error fetching cumulative washed data:", error);
            } finally {
                setLoading(false);
            }
        };

        getCumulatifData();
    }, [limit, pointer, search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPointer(0);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalCount / limit) || 1;

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setPointer((pageNumber - 1) * limit);
    };

    const onLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPointer(0);
        setCurrentPage(1);
    };

    const datapagination = {
        totalCount: totalCount,
        currentPage: currentPage,
        onPageChange: onPageChange,
        totalPages: totalPages,
        pointer: pointer,
        onLimitChange: onLimitChange,
        limit: limit,
    };

    const grandTotalKg = MOCK_CUMULATIF_WASHED.reduce(
        (acc, item) => acc + item.total_quantite_washed,
        0
    );

    const handleExportCumulatif = async () => {
        setLoadingExportBtn(true);
        try {
            const formattedData = MOCK_CUMULATIF_WASHED.map((item) => ({
                "ID Société": item.id,
                Société: item.societe,
                "Quantité Total Washed (Kg)": item.total_quantite_washed,
                Qualité: item.qualite,
                "Nombre d'Achats": item.nb_achats,
            }));

            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Cumulatif Washed");
            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });
            const blob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
            });

            setExportBlob(blob);
            setActiveDownloadBtn(true);
        } catch (error) {
            console.error("Erreur d'exportation :", error);
            toast.error("Erreur lors de l'exportation");
        } finally {
            setLoadingExportBtn(false);
        }
    };

    const downloadExcel = () => {
        if (!exportBlob) return;
        const date = new Date().toISOString().split("T")[0];
        saveAs(exportBlob, `cumulatif_quantite_washed_par_societe_${date}.xlsx`);
        setActiveDownloadBtn(false);
        setExportBlob(null);
    };

    // const columns = [
    //     {
    //         accessorKey: "societe",
    //         header: ({ column }) => (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Société
    //                 <ArrowUpDownIcon />
    //             </Button>
    //         ),
    //         cell: ({ row }) => (
    //             <div className="flex items-center gap-3">
    //                 <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
    //                     <svg
    //                         xmlns="http://www.w3.org/2000/svg"
    //                         viewBox="0 0 24 24"
    //                         fill="currentColor"
    //                         className="size-6 text-gray-500"
    //                     >
    //                         <path
    //                             fillRule="evenodd"
    //                             d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
    //                             clipRule="evenodd"
    //                         />
    //                         <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
    //                     </svg>
    //                 </div>
    //                 <div>
    //                     <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
    //                         {row.getValue("societe")}
    //                     </span>
    //                     <span className="block text-gray-500 text-theme-xs dark:text-gray-400 mt-1">
    //                         {row.original.id}
    //                     </span>
    //                 </div>
    //             </div>
    //         ),
    //     },
    //     {
    //         accessorKey: "total_quantite_washed",
    //         header: ({ column }) => (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Quantité Washed Déjà Collectée
    //                 <ArrowUpDownIcon />
    //             </Button>
    //         ),
    //         cell: ({ row }) => {
    //             const totalKg = Number(row.getValue("total_quantite_washed")) || 0;
    //             return (
    //                 <div className="font-semibold text-gray-800 dark:text-white/90">
    //                     {totalKg.toLocaleString("fr-FR")} Kg
    //                 </div>
    //             );
    //         },
    //     },
    //     {
    //         accessorKey: "qualite",
    //         header: "Qualité",
    //         cell: ({ row }) => (
    //             <div className="flex flex-col gap-1">
    //                 {
    //                     row.getValue("qualite") ? (
    //                         row.getValue("qualite").map((item) => (
    //                             <span className="flex items-center gap-2" key={item.label}>
    //                                 <span className="rounded-full w-2 h-2 bg-primary" />
    //                                 <span className="text-xs text-gray-500 dark:text-gray-400">
    //                                     {item.label}: {item.quantite} Kg
    //                                 </span>
    //                             </span>
    //                         ))
    //                     ) : (
    //                         <span className="text-sm text-gray-500 dark:text-gray-400">
    //                             Aucune qualité
    //                         </span>
    //                     )
    //                 }
    //             </div>
    //         ),
    //     },
    //     {
    //         accessorKey: "nb_achats",
    //         header: "Nombre de Collectes",
    //         cell: ({ row }) => (
    //             <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
    //                 {row.getValue("nb_achats")}
    //             </div>
    //         ),
    //     },
    // ];

    // const table = useReactTable({
    //     data,
    //     columns,
    //     onSortingChange: setSorting,
    //     onColumnFiltersChange: setColumnFilters,
    //     getCoreRowModel: getCoreRowModel(),
    //     getPaginationRowModel: getPaginationRowModel(),
    //     getSortedRowModel: getSortedRowModel(),
    //     getFilteredRowModel: getFilteredRowModel(),
    //     onColumnVisibilityChange: setColumnVisibility,
    //     onRowSelectionChange: setRowSelection,
    //     state: {
    //         sorting,
    //         columnFilters,
    //         columnVisibility,
    //         rowSelection,
    //     },
    // });

    return (
        <div className="space-y-4">
            {/* Cartes Synthétiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-sidebar">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Washed Collecté
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-secondary">
                            {(data.total_quantite_washed / 1000).toFixed(2)} T
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.total_quantite_washed?.toLocaleString("fr-FR")} Kg au total
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-sidebar">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Sociétés Actives
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.total_societe} Sociétés
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Avec collecte de café washed enregistrée
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-sidebar">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Opérations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold ">
                            {data.nb_achats?.toLocaleString("fr-FR")} Achats
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Operations cumulées d'achat
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* <div className="w-full bg-sidebar p-4 rounded-lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
                    <div className="relative">
                        <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5" />
                        <input
                            placeholder="Rechercher..."
                            value={search}
                            onChange={handleSearch}
                            className="pl-10 h-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none focus-visible:ring-0"
                        />
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                        <ExportButton
                            handleExportSDLs={handleExportCumulatif}
                            exportType="sdl_data"
                            loading={loadingExportBtn}
                            activedownloadBtn={activeDownloadBtn}
                            onClickDownloadButton={downloadExcel}
                        />
                    </div>
                </div>

                <div className="grid w-full [&>div]:border [&>div]:rounded-md">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="sticky top-0 bg-background z-10 hover:bg-background">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isActuallyLoading ? (
                                <TableRowsSkeleton columns={columns.length} rows={limit} />
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Pas de données
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
                    <PaginationContent
                        datapaginationlimit={onLimitChange}
                        currentPage={datapagination.currentPage}
                        totalPages={datapagination.totalPages}
                        onPageChange={datapagination.onPageChange}
                        pointer={datapagination.pointer}
                        totalCount={datapagination.totalCount}
                        onLimitChange={datapagination.onLimitChange}
                    />
                </div>
            </div> */}
        </div>
    );
}
