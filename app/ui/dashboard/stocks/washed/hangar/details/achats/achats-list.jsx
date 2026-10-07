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
import PaginationControls from "@/components/ui/pagination-controls";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, TrashIcon } from "lucide-react";
import Edit from "./edit";

export default function AchatsWashed({ data, datapagination }) {
    return (
        <div className="w-full">
            <div className="w-full border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-4">Action</TableHead>
                            <TableHead>Societe</TableHead>
                            <TableHead>Hangar</TableHead>
                            <TableHead>Quantite</TableHead>
                            <TableHead>Qualite</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Aucun achat trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.map((achat) => (
                                <TableRow key={achat.id} className="odd:bg-muted/50">
                                    <TableCell className="pl-4">
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
                                                <div>
                                                    <Edit id={achat.id} item={achat} />
                                                </div>
                                                <DropdownMenuItem
                                                    className="cursor-pointer gap-2 font-medium text-destructive"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                    <span>Supprimer</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell>{achat.societe}</TableCell>
                                    <TableCell>{achat.hangar}</TableCell>
                                    <TableCell>{achat.quantite}</TableCell>
                                    <TableCell>{achat.qualite}</TableCell>
                                    <TableCell className="font-medium">{achat.date}</TableCell>
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
