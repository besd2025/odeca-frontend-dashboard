
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
import { useState } from "react";

const products = [
    {
        id: 101,
        societe: "ODECA",
        cafeParche: [{ id: 1, name: "15+", quantite: 100, nbreSacs: 10 }, { id: 2, name: "TT", quantite: 150, nbreSacs: 15 }],
    },
];

export default function SocietesQty() {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [onLimitChange, setOnLimitChange] = useState(() => (newLimit) => {
        setLimit(newLimit);
        setPointer(0);
        setCurrentPage(1);
    });
    const [pointer, setPointer] = useState(0);
    const [totalCount, setTotalCount] = useState(products.length);
    const [onPageChange, setOnPageChange] = useState(() => (pageNumber) => {
        setCurrentPage(pageNumber);
        setPointer((pageNumber - 1) * limit);
    });
    return (
        <div className="w-full bg-card p-4 rounded-lg border">

            <div className="w-full overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-4">ID</TableHead>
                            <TableHead>Societe</TableHead>
                            <TableHead>Cafe Parche</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow className="odd:bg-muted/50" key={product.id}>
                                <TableCell className="pl-4">{product.id}</TableCell>
                                <TableCell className="font-medium">{product.societe}</TableCell>
                                <TableCell>{product.cafeParche.map((cafe) => (
                                    <div key={cafe.id} className=""> <span className="font-semibold text-primary text-base">{cafe.name} {" "}:</span> <span className="text-xs ml-2">{cafe.nbreSacs} Kg</span></div>
                                ))}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
                <div className="flex-1 text-sm text-muted-foreground"></div>
                <PaginationContent
                    datapaginationlimit={() => { }}
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalCount / limit)}
                    onPageChange={onPageChange}
                    pointer={pointer}
                    totalCount={totalCount}
                    onLimitChange={onLimitChange}
                />
            </div>
        </div>
    );
}
