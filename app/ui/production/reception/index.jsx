"use client";

import React, { useState, useEffect } from 'react'
import ProtectedRoute from '../../protection/ProtectedRoute';
import { ROLES } from "@/lib/permissions";
import { Inbox, CheckCircle2, Clock, MoreHorizontal, PlusCircle, Layers, Settings } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const DEFAULT_RECEPTIONS = [
    {
        id: "LOT-2026-001",
        societe: "SOGESTAL Ngozi",
        sdls: ["SDL Ngozi", "SDL Gitega"],
        dateTransfert: "2026-05-14",
        dateReception: "2026-05-15",
        poidsNet: 15000.00,
        status: "confirmé",
    },
    {
        id: "LOT-003",
        societe: "COCOCA",
        sdls: ["SDL Muramvya", "SDL Karusi"],
        dateTransfert: "2025-05-22",
        dateReception: "-",
        poidsNet: 8850.00,
        status: "en attente",
    },
    {
        id: "LOT-004",
        societe: "SOGESTAL Kayanza",
        sdls: ["SDL Muramvya"],
        dateTransfert: "2025-05-23",
        dateReception: "2025-05-24",
        poidsNet: 4720.00,
        status: "confirmé",
    },
];

export default function ReceptionPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [receptionsList, setReceptionsList] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem("odeca_receptions");
        if (stored) {
            setReceptionsList(JSON.parse(stored));
        } else {
            setReceptionsList(DEFAULT_RECEPTIONS);
            localStorage.setItem("odeca_receptions", JSON.stringify(DEFAULT_RECEPTIONS));
        }
    }, []);

    const filteredReceptions = receptionsList.filter((lot) => {
        if (activeTab === "all") return true;
        return lot.status.toLowerCase() === activeTab.toLowerCase();
    });

    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
            <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Inbox className="h-8 w-8 text-primary" /> Réception
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Enregistrement et pesée des nouveaux lots de café déparché en provenance des Stations de Lavage (SDL).
                        </p>
                    </div>
                </div>

                <div className="w-full bg-card rounded-md p-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="flex w-full overflow-x-auto justify-start h-10 p-1 bg-slate-100 dark:bg-slate-900 select-none mb-4 gap-1">
                            <TabsTrigger value="all" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer">
                                <Layers className="h-3.5 w-3.5 text-slate-500" />
                                <span>Tous ({receptionsList.length})</span>
                            </TabsTrigger>
                            <TabsTrigger value="en attente" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                <span>En attente ({receptionsList.filter(r => r.status === "en attente").length})</span>
                            </TabsTrigger>
                            <TabsTrigger value="confirmé" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                <span>Confirmé ({receptionsList.filter(r => r.status === "confirmé").length})</span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="w-full overflow-x-auto mt-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">Actions</TableHead>
                                    <TableHead>Société</TableHead>
                                    <TableHead>Date Transfert</TableHead>
                                    <TableHead>Date Réception</TableHead>
                                    <TableHead className="text-right">Poids Net (kg)</TableHead>
                                    <TableHead className="text-center">Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReceptions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400 font-medium">
                                            Aucun lot trouvé avec ce statut.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredReceptions.map((lot) => (
                                        <TableRow className="odd:bg-muted/50" key={lot.id}>
                                            <TableCell className="pl-4 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align='start'>
                                                            {lot.status === "en attente" ? (
                                                                <Link href={`/odeca-production/usine/reception/confirmation/?id=${lot.id}&societe=${encodeURIComponent(lot.societe)}&sdls=${encodeURIComponent(lot.sdls.join(","))}&poidsNet=${lot.poidsNet}&date=${lot.dateReception}`}>
                                                                    <DropdownMenuItem className="cursor-pointer">Confirmer</DropdownMenuItem>
                                                                </Link>
                                                            ) : (
                                                                <Link href={`/odeca-production/usine/usinage/?receptionId=${lot.id}`}>
                                                                    <Button size="sm" variant="default" className="w-full gap-1 cursor-pointer">
                                                                        <Settings className="h-3 w-3" /> Usiner
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                            <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">Rejeter</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold"><div className="flex flex-col gap-1">
                                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                                    {lot.societe}
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {lot.sdls.map((sdl) => (
                                                        <span
                                                            key={sdl}
                                                            className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                                                        >
                                                            {sdl}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div></TableCell>
                                            <TableCell>{lot.dateTransfert}</TableCell>
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
                                    )))}
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
