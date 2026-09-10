"use client";

import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import PaginationControls from "@/components/ui/pagination-controls";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TrashIcon } from "lucide-react";
import Edit from "./edit";

const products = [
    {
        id: 101,
        date: "12/8/2025",
        sdl_ct_type: "SDL",
        sdl_ct_name: "Ngome",
        No_fiche: 59.99,
        No_recus: 4.5,
        ca: 452,
        cb: 52,
        fiche_photo: "/images/logo_1.jpg",
        montant: 5555555,
    },
    {
        id: 102,
        date: "12/8/2025",
        sdl_ct_type: "SDL",
        sdl_ct_name: "Ngome",
        No_fiche: 59.99,
        No_recus: 4.5,
        ca: 452,
        cb: 52,
        fiche_photo: "/images/logo_1.jpg",
        montant: 5555555,
    },
];

export default function AchatsWashed() {
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);

    const totalItems = products.length;
    const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

    React.useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const paginatedProducts = React.useMemo(() => {
        const start = (page - 1) * pageSize;
        return products.slice(start, start + pageSize);
    }, [page, pageSize]);
    const handleSaveEdit = (updatedItem) => {
        setData((prev) =>
            prev.map((item) => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
        );
    };
    return (
        <div className="w-full">
            <div className="w-full border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-4">Action</TableHead>
                            <TableHead>Societe</TableHead>
                            <TableHead>Quantite</TableHead>
                            <TableHead>Qualite</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedProducts.map((product) => (
                            <TableRow key={product.id} className="odd:bg-muted/50">
                                <TableCell className="pl-4">  <DropdownMenu>
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


                                        <div>
                                            <Edit id={product.id} item={product} onSave={handleSaveEdit} />

                                        </div>

                                        <DropdownMenuItem
                                            className="cursor-pointer gap-2 font-medium text-destructive"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                            <span>Supprimer</span>
                                        </DropdownMenuItem>

                                    </DropdownMenuContent>
                                </DropdownMenu></TableCell>
                                <TableCell className="font-medium">{product.date}</TableCell>
                                <TableCell>
                                    {product.sdl_ct_type} {product.sdl_ct_name}
                                </TableCell>
                                <TableCell>{product.No_fiche}</TableCell>
                                <TableCell>{product.No_recus}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
                <PaginationContent
                    datapaginationlimit={onLimitChange}
                    currentPage={datapagination.currentPage}
                    totalPages={datapagination.totalPages}
                    onPageChange={datapagination.onPageChange}
                    pointer={datapagination.pointer}
                    totalCount={datapagination.totalCount}
                    onLimitChange={datapagination.onLimitChange}
                />
            </div> */}
        </div>
    );
}
