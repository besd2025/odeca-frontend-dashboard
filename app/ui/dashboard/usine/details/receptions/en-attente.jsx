import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import PaginationContent from '@/components/ui/pagination-content';

export default function EnAttenteReception() {
    const [loading, setLoading] = React.useState(false);
    const DEFAULT_RECEPTIONS = [
        {
            id: "LOT-2026-001",
            societe: "SOGESTAL Ngozi",
            sdls: ["SDL Ngozii"],
            dateTransfert: "2026-05-14",
            dateReception: "2026-05-15",
            poidsNet: 15000.00,
            status: "confirmé",
        }
    ];

    const TRIAGE_GRADES = [{ grade: "A1", poidsNet: 1000, status: "CONFIRMEE" }, { grade: "A2", poidsNet: 1000, status: "CONFIRMEE" }];
    const [gradesList, setGradesList] = React.useState(TRIAGE_GRADES);
    const [open, setOpen] = useState(false)
    return (
        <div className="grid w-full [&>div]:border [&>div]:rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-4">Actions</TableHead>
                        <TableHead>Société</TableHead>
                        <TableHead>Usine</TableHead>
                        <TableHead>Date Transfert</TableHead>
                        <TableHead>Date Réception</TableHead>
                        <TableHead className="text-right">Poids Net (kg)</TableHead>
                        <TableHead className="text-center">Statut</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRowsSkeleton columns={6} rows={5} />
                    ) : DEFAULT_RECEPTIONS.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400 font-medium">
                                Aucun lot trouvé avec ce statut.
                            </TableCell>
                        </TableRow>
                    ) : (
                        DEFAULT_RECEPTIONS.map((lot, index = 0) => (
                            <TableRow className="odd:bg-muted/50" key={index + 1}>
                                <TableCell className="pl-4 font-medium">
                                    <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='start'>

                                                <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)} >Détails</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer" >Modifier</DropdownMenuItem>

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold"><div className="flex flex-col gap-1">
                                    <span className="font-medium text-slate-800 dark:text-slate-200">
                                        {lot.societe}
                                    </span>
                                    <div className="flex flex-wrap gap-1">

                                        <span
                                            key={lot.id}
                                            className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                                        >
                                            {lot.sdls || "-"}
                                        </span>

                                    </div>
                                </div></TableCell>
                                <TableCell className="font-semibold">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-slate-800 dark:text-slate-200">
                                            {lot.usine || "-"}
                                        </span>
                                    </div>
                                </TableCell>
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

            <PaginationContent
            // page={table.getState().pagination.pageIndex + 1}
            // pageSize={table.getState().pagination.pageSize}
            // totalItems={table.getFilteredRowModel().rows.length}
            // totalPages={table.getPageCount()}
            // onPageChange={(pageNumber) => table.setPageIndex(pageNumber - 1)}
            // onPageSizeChange={(size) => table.setPageSize(size)}
            // hasNextPage={table.getCanNextPage()}
            // hasPreviousPage={table.getCanPreviousPage()}
            />
            <Dialog open={open} onOpenChange={setOpen}>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Details grades receptionne</DialogTitle>


                        <div className="space-y-2 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Société */}
                                <div className="space-y-2">
                                    <Label htmlFor="societe" className="text-xs  text-slate-700 dark:text-slate-300">
                                        Société / Propriétaire
                                    </Label>
                                    <span>
                                        {DEFAULT_RECEPTIONS[0].societe}
                                    </span>
                                </div>
                                {/* SDL */}
                                <div className="space-y-2">
                                    <Label htmlFor="sdl" className="text-xs  text-slate-700 dark:text-slate-300">
                                        Station de Lavage
                                    </Label>
                                    <span>
                                        {DEFAULT_RECEPTIONS[0].sdls}
                                    </span>

                                </div>


                            </div>


                        </div>
                        <div className="w-full overflow-x-auto mt-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Grades</TableHead>
                                        <TableHead className="text-right">Poids Net (kg)</TableHead>
                                        <TableHead className="text-center">Statut</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {gradesList.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400 font-medium">
                                                Aucun grades trouvé.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        gradesList.map((grade) => (
                                            <TableRow className="odd:bg-muted/50" key={grade.id}>

                                                <TableCell className="font-semibold"><div className="flex flex-col gap-1">
                                                    <span className="font-medium text-slate-800 dark:text-slate-200">
                                                        {grade.grade}
                                                    </span>

                                                </div></TableCell>
                                                <TableCell className="text-right font-semibold">{grade.poidsNet.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}</TableCell>
                                                <TableCell className="text-center lowercase">
                                                    {grade.status === "CONFIRMEE" ? (
                                                        <div className='gap-2 flex items-center justify-center'>
                                                            <Badge variant="default" className="gap-1 bg-secondary dark:text-emerald-400">
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
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}
