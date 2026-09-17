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
    },
];

export default function Transfers({ data }) {
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    console.log(data)
    const totalItems = data?.length;
    const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

    React.useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const paginatedProducts = React.useMemo(() => {
        const start = (page - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [page, pageSize]);

    return (
        <div className="w-full">
            <div className="w-full border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-4">#</TableHead>
                            <TableHead>Societe</TableHead>
                            <TableHead>From SDL</TableHead>
                            <TableHead>Usine</TableHead>
                            <TableHead>Fiche</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((product, index) => (
                            <TableRow key={product.id} className="odd:bg-muted/50">
                                <TableCell className="pl-4">{index + 1}</TableCell>
                                <TableCell>{product.society}</TableCell>
                                <TableCell>
                                    {product.to_depulpeur_name}
                                </TableCell>
                                <TableCell>{product.usine}</TableCell>
                                <TableCell>
                                    <ViewImageDialog
                                        imageUrl={product.fiche_photo}
                                        profile={false}
                                    />
                                </TableCell>
                                <TableCell>{product.date_transfert}</TableCell>
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
