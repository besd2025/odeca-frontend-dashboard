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

export default function Transfers({ data, datapagination }) {
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
                        {data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Aucun transfert trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.map((product, index) => (
                                <TableRow key={product.id} className="odd:bg-muted/50">
                                    <TableCell className="pl-4">{index + 1}</TableCell>
                                    <TableCell>{product.society}</TableCell>
                                    <TableCell>{product.to_depulpeur_name}</TableCell>
                                    <TableCell>{product.usine}</TableCell>
                                    <TableCell>
                                        <ViewImageDialog
                                            imageUrl={product.fiche_photo}
                                            profile={false}
                                        />
                                    </TableCell>
                                    <TableCell>{product.date_transfert}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {datapagination && (
                <PaginationControls
                    className="mt-4"
                    page={datapagination.currentPage}
                    pageSize={datapagination.limit}
                    totalItems={datapagination.totalCount}
                    totalPages={datapagination.totalPages}
                    onPageChange={datapagination.onPageChange}
                    onPageSizeChange={datapagination.onLimitChange}
                    hasNextPage={datapagination.currentPage < datapagination.totalPages}
                    hasPreviousPage={datapagination.currentPage > 1}
                />
            )}
        </div>
    );
}
