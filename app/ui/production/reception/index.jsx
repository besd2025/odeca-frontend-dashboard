import React from 'react'
import ProtectedRoute from '../../protection/ProtectedRoute';
import { ROLES } from "@/lib/permissions";
import { Inbox, CheckCircle2, Clock, MoreHorizontal } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import PaginationContent from '@/components/ui/pagination-content';
import Link from 'next/link';

const receptions = [
    {
        id: "LOT-001",
        societe: "KIREMA",
        sdls: ["SDL Ngozi", "SDL Kayanza"],
        dateReception: "2025-05-20",
        poidsNet: 7080.00,
        status: "confirmé",
    },
    {
        id: "LOT-002",
        societe: "KIRYAMA",
        sdls: ["SDL Gitega"],
        dateReception: "2025-05-21",
        poidsNet: 5605.00,
        status: "confirmé",
    },
    {
        id: "LOT-003",
        societe: "COCOCA",
        sdls: ["SDL Muramvya", "SDL Karusi"],
        dateReception: "2025-05-22",
        poidsNet: 8850.00,
        status: "en attente",
    },
    {
        id: "LOT-004",
        societe: "SOGESTAL Mumirwa",
        sdls: ["SDL Muramvya"],
        dateReception: "2025-05-23",
        poidsNet: 4720.00,
        status: "en attente",
    },
]


export default function ReceptionPage() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
            <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Inbox className="h-8 w-8 text-primary" /> Réception des Lots
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Enregistrement et pesée des nouveaux lots de café déparché en provenance des Stations de Lavage (SDL).
                        </p>
                    </div>

                </div>

                <div className="w-full bg-card rounded-md p-2">
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">Actions</TableHead>
                                    <TableHead>Société</TableHead>
                                    <TableHead>Date Réception</TableHead>
                                    <TableHead className="text-right">Poids Net (kg)</TableHead>
                                    <TableHead className="text-center">Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {receptions.map((lot) => (
                                    <TableRow className="odd:bg-muted/50" key={lot.id}>
                                        <TableCell className="pl-4 font-medium">
                                            <div className="flex items-center gap-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <Link href={`/odeca-production/usine/reception/confirmation/?id=${lot.id}&societe=${encodeURIComponent(lot.societe)}&sdls=${encodeURIComponent(lot.sdls.join(","))}&poidsNet=${lot.poidsNet}&date=${lot.dateReception}`}>
                                                            <DropdownMenuItem className="cursor-pointer">Confirmer</DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">Rejeter</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold">{lot.societe}</TableCell>

                                        <TableCell>{lot.dateReception}</TableCell>
                                        <TableCell className="text-right font-semibold">{lot.poidsNet.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell className="text-center lowercase">
                                            {lot.status === "confirmé" ? (
                                                <div className='gap-2 flex items-center justify-center'>
                                                    <Badge variant="default" className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                        <CheckCircle2 size={24} />
                                                    </Badge>
                                                    <span>Confirmé</span>
                                                </div>

                                            ) : (
                                                <div className='gap-2 flex items-center justify-center'>
                                                    <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
                                                        <Clock size={24} />
                                                    </Badge>
                                                    <span>En attente</span>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>
                                    2
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination> */}

                    <PaginationContent
                    // datapaginationlimit={() => { }}
                    // currentPage={datapagination.currentPage}
                    // totalPages={datapagination.totalPages}
                    // onPageChange={datapagination.onPageChange}
                    // pointer={datapagination.pointer}
                    // totalCount={datapagination.totalCount}
                    // onLimitChange={datapagination.onLimitChange}
                    // limit={datapagination.limit}
                    />
                </div>
            </div>
        </ProtectedRoute>
    );
}
