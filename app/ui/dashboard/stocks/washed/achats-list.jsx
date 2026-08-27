"use client";

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDownIcon, MoreHorizontal, Search } from "lucide-react";
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { TableRowsSkeleton } from "@/components/ui/skeletons";
import { TrashIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ExportButton from "@/components/ui/export_button";
import Filter from "./filter";
import Edit from "./edit";
import { Badge } from "@/components/ui/badge";
import PaginationContent from "@/components/ui/pagination-content";
import { UserContext } from "@/app/ui/context/User_Context";
const XLSX = require("xlsx");
import { saveAs } from "file-saver";
import { toast } from "sonner";
import AddHangar from "./add-hangar";
import { fetchData } from "@/app/_utils/api";
// MockData pour les achats de café Washed
// TODO API: Remplacer MOCK_ACHATS_WASHED par un appel à fetchData("get", "cafe/achat_washed/")

export default function AchatsWashedListTable({ isLoading: externalLoading }) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [filterData, setFilterData] = React.useState({});
    const isActuallyLoading = externalLoading ?? loading;

    const [limit, setLimit] = useState(5);
    const [pointer, setPointer] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const [loadingExportBtn, setLoadingExportBtn] = useState(false);
    const [activeDownloadBtn, setActiveDownloadBtn] = useState(false);
    const [exportBlob, setExportBlob] = useState(null);
    const user = useContext(UserContext)
    React.useEffect(() => {
        const getAchats = async () => {
            setLoading(true);
            try {
                const response = await fetchData("get", "cafe/achat_cafe_parche/", {
                    params: {
                        limit: limit,
                        offset: pointer,
                        search: search,
                        ...filterData,
                    },
                    additionalHeaders: {}
                });
                const newData = response?.results?.map((item) => {
                    return {
                        id: item?.id,
                        societe: item?.responsable?.sdl_ct?.sdl?.societe?.nom_societe,
                        hangar: item?.responsable?.sdl_ct?.sdl?.sdl_nom,
                        quantite_washed: item?.quantite,
                        qualite: item?.qualite,
                        date: item?.date_achat
                    };
                });
                setData(newData || []);
                setTotalCount(response?.count || 0);
            } catch (error) {
                console.error("Error fetching individual achats:", error);
            } finally {
                setLoading(false);
            }
        };

        getAchats();
    }, [limit, pointer, filterData, search]);

    const handleSaveEdit = (updatedItem) => {
        setData((prev) =>
            prev.map((item) => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
        );
    };

    const handleFilter = (filters) => {
        setFilterData(filters);
        setPointer(0);
        setCurrentPage(1);
    };

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

    const handleExportWashed = async () => {
        setLoadingExportBtn(true);
        try {


            const initResponse = await fetchData("get", `cafe/achat_cafe_parche/`, {
                params: { limit: 1 },
            });
            const total = initResponse?.count || 0;
            if (total === 0) {
                setLoadingExportBtn(false);
                return;
            }

            const response = await fetchData("get", `cafe/achat_cafe_parche/`, {
                params: { limit: total },
            });

            const formattedData = response?.results?.map((item) => ({
                id: item?.id,
                societe: item?.responsable?.sdl_ct?.sdl?.societe?.nom_societe,
                hangar: item?.responsable?.sdl_ct?.sdl?.sdl_nom,
                quantite_washed: item?.quantite,
                qualite: item?.qualite,
                date: item?.date_achat
            }));

            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Achats Washed");
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
            toast.error("Erreur lors de l'exportation Excel");
        } finally {
            setLoadingExportBtn(false);
        }
    };

    const downloadExcel = () => {
        if (!exportBlob) return;
        const now = new Date();
        const date = now.toISOString().split("T")[0];
        saveAs(exportBlob, `achats_cafe_washed_${date}.xlsx`);
        setActiveDownloadBtn(false);
        setExportBlob(null);
    };

    const HandleDelete = async (id, hangar) => {
        const promise = new Promise(async (resolve, reject) => {
            console.log("code", id);
            try {
                await fetchData(
                    "delete",
                    `/cafe/achat_cafe_parche/${id}/`,
                    {
                        params: {},
                        additionalHeaders: {},

                    },
                );
                resolve({ hangar: hangar || 'L\'achat' });
            } catch (error) {
                reject(error);
            }
        });

        toast.promise(promise, {
            loading: "SUPPRESSION...",
            success: (data) => {
                // setTimeout(() => window.location.reload(), 1000);
                return `L'achat de ${data.hangar} a été supprimé avec succès `;
            },
            error: "Donnée non supprimée",
        });

        try {
            await promise;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            id: "actions",
            enableHiding: false,
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original;
                return (
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
                            <DropdownMenuItem
                                onClick={() => {
                                    navigator.clipboard.writeText(item.id);
                                    toast.success("ID copié !");
                                }}
                            >
                                Copier ID
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            {user?.session.category == "Admin" || user?.session.category == "Superviseur" ? (
                                <>
                                    <div>
                                        <Edit id={item.id} item={item} onSave={handleSaveEdit} />

                                    </div>

                                </>
                            ) : (null)}
                            {(user?.session?.category === "Admin" || user?.session?.category === "Superviseur") ? (
                                <DropdownMenuItem
                                    onClick={() => HandleDelete(item.id, item.hangar)}
                                    className="cursor-pointer gap-2 font-medium text-destructive"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    <span>Supprimer</span>
                                </DropdownMenuItem>
                            ) : (null)}

                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        {
            accessorKey: "societe",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Société
                    <ArrowUpDownIcon />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 text-gray-500"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                                clipRule="evenodd"
                            />
                            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
                        </svg>
                    </div>
                    <div>
                        <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                            {row.getValue("societe")}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400 mt-1">
                            <span className="capitalize font-medium mr-1 text-primary">Hangar:</span> <span className="lowercase">{row.original.hangar}</span>
                        </span>
                    </div>
                </div>
            ),
        },
        // {
        //     accessorKey: "hangar",
        //     header: ({ column }) => (
        //         <Button
        //             variant="ghost"
        //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        //         >
        //             Hangar
        //             <ArrowUpDownIcon />
        //         </Button>
        //     ),
        //     cell: ({ row }) => (
        //         <div className="font-medium text-gray-800 dark:text-white/90">
        //             {row.getValue("hangar")}
        //         </div>
        //     ),
        // },
        {
            accessorKey: "quantite_washed",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Quantité Washed
                    <ArrowUpDownIcon />
                </Button>
            ),
            cell: ({ row }) => {
                const qte = Number(row.getValue("quantite_washed")) || 0;
                return (
                    <div className="font-medium text-gray-800 dark:text-white/90">
                        {qte.toLocaleString("fr-FR")} Kg
                    </div>
                );
            },
        },
        {
            accessorKey: "qualite",
            header: "Qualité",
            cell: ({ row }) => {
                const qualite = row.getValue("qualite");
                return (
                    <Badge variant="outline" className="font-medium bg-secondary/10 text-secondary border-secondary/30">
                        {qualite}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "date",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDownIcon />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    {row.getValue("date")}
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full bg-sidebar p-4 rounded-lg">
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

                <div className="flex flex-row justify-between gap-x-3">
                    <div className="flex items-center gap-3">
                        <Filter handleFilter={handleFilter} />
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                        {user?.session?.category === "Admin" && <AddHangar />}
                        <ExportButton
                            handleExportSDLs={handleExportWashed}
                            exportType="sdl_data"
                            loading={loadingExportBtn}
                            activedownloadBtn={activeDownloadBtn}
                            onClickDownloadButton={downloadExcel}
                        />
                    </div>
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
        </div>
    );
}
