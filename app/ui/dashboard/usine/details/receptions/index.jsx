"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, CheckCircle2, Clock, Layers, Search } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PaginationControls from "@/components/ui/pagination-controls";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableRowsSkeleton } from "@/components/ui/skeletons";
import { MoreHorizontal, PlusCircle, Settings } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";

export default function Receptions({ data = [] }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Mock data handling
  const defaultData = React.useMemo(
    () => [
      {
        id: 1,
        date: "2024-05-15",
        proprietaire: "Coopérative KAWA",
        categorie: "Cerise Grade A",
        quantite: 5000,
        lot: "LOT-24-001",
        statut: "Validé",
        sdl: "SDL Ngozi"
      },
      {
        id: 2,
        date: "2024-05-16",
        proprietaire: "SOGESTAL",
        categorie: "Cerise Grade B",
        quantite: 3200,
        lot: "LOT-24-002",
        statut: "En attente",
      },
      {
        id: 3,
        date: "2024-05-18",
        proprietaire: "Coopérative KAWA",
        categorie: "Parche",
        quantite: 1500,
        lot: "LOT-24-003",
        statut: "Validé",
      },
    ],
    [],
  );
  const DEFAULT_RECEPTIONS = [
    {
      id: "LOT-2026-001",
      societe: "SOGESTAL Ngozi",
      sdls: ["SDL Ngozi"],
      dateTransfert: "2026-05-14",
      dateReception: "2026-05-15",
      poidsNet: 15000.00,
      status: "confirmé",
    }
  ];
  const TRIAGE_GRADES = [{ grade: "A1", poidsNet: 1000, status: "CONFIRMEE" }, { grade: "A2", poidsNet: 1000, status: "CONFIRMEE" }];
  const [gradesList, setGradesList] = React.useState(TRIAGE_GRADES);

  const tableData = data?.length > 0 ? data : defaultData;



  const table = useReactTable({
    data: tableData,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });


  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false)
  const handleTabChange = (val) => {
    setActiveTab(val);
    setPointer(0);
    setCurrentPage(1);
  };

  return (
    <div className="">
      {/* List Section */}
      <div className="w-full bg-sidebar p-2 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5" />
            <Input
              placeholder="Rechercher par propriétaire..."
              onChange={(event) => {

              }}
              className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
            />
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex w-1/2 overflow-x-auto justify-start h-10 p-1 bg-slate-100 dark:bg-slate-900 select-none mb-4 gap-1">
            <TabsTrigger value="all" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer">
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              <span>Tous ({data?.length})</span>
            </TabsTrigger>
            <TabsTrigger value="en attente" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>En attente ({data?.length})</span>
            </TabsTrigger>
            <TabsTrigger value="confirmé" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Confirmé ({data?.length})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <PaginationControls
            page={table.getState().pagination.pageIndex + 1}
            pageSize={table.getState().pagination.pageSize}
            totalItems={table.getFilteredRowModel().rows.length}
            totalPages={table.getPageCount()}
            onPageChange={(pageNumber) => table.setPageIndex(pageNumber - 1)}
            onPageSizeChange={(size) => table.setPageSize(size)}
            hasNextPage={table.getCanNextPage()}
            hasPreviousPage={table.getCanPreviousPage()}
          />
        </div>
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
    </div>
  );
}
