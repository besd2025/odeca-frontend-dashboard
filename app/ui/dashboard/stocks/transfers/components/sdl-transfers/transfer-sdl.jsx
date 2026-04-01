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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ExportButton from "@/components/ui/export_button";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import PaginationContent from "@/components/ui/pagination-content";
import { UserContext } from "@/app/ui/context/User_Context";
import { toast } from "sonner";
import { fetchData } from "@/app/_utils/api";

export default function TransferSdlDep({
  data = [],
  datapagination,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [loading, setLoading] = useState(false);
  const user = React.useContext(UserContext);
  
  // Local state as fallback
  const [currentPage, setCurrentPage] = useState(1);
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(10);

  const totalCount = datapagination?.totalCount ?? data.length;
  const resolvedTotalPages = datapagination?.totalPages ?? Math.ceil(totalCount / limit);
  const resolvedCurrentPage = datapagination?.currentPage ?? currentPage;
  const resolvedPointer = datapagination?.pointer ?? pointer;
  const resolvedLimit = datapagination?.limit ?? limit;

  const onPageChange = (page) => {
    if (datapagination?.onPageChange) {
      datapagination.onPageChange(page);
    } else {
      setCurrentPage(page);
      setPointer((page - 1) * limit);
    }
  };

  const onLimitChange = (newLimit) => {
    if (datapagination?.onLimitChange) {
      datapagination.onLimitChange(newLimit);
    } else {
      setLimit(newLimit);
      setPointer(0);
      setCurrentPage(1);
    }
  };

  const paginatedData = data;

  const columns = [
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const transfer = row.original;
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${transfer.id}`)}>
                Copier ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Add more actions if needed */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "from_sdl",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          SDL Source
          <ArrowUpDownIcon />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("from_sdl")}</div>,
    },
    {
      accessorKey: "usine",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Usine destination
          <ArrowUpDownIcon />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("usine")}</div>,
    },
    {
      accessorKey: "society",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Société
          <ArrowUpDownIcon />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("society")}</div>,
    },
    {
      id: "localite",
      header: "Localité",
      cell: ({ row }) => {
        const localite = row.original.localite;
        return <div className="text-sm">{localite?.province}, {localite?.commune}</div>;
      },
    },
    {
      id: "ca",
      header: "Quantité (kg)",
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.original.qte_tranferer?.ca ?? 0}
        </div>
      ),
    },
    {
      id: "photo_fiche",
      header: "Fiche",
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.original.photo_fiche ? (
            <ViewImageDialog imageUrl={row.original.photo_fiche} alt="Photo fiche" profile={false} />
          ) : "-"}
        </div>
      ),
    },
    {
      id: "date",
      header: "Date transfert",
      cell: ({ row }) => <div className="text-center font-semibold">{row.original.date ?? "-"}</div>,
    },
  ];

  const table = useReactTable({
    data: paginatedData,
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
    manualPagination: true,
  });

  return (
    <div className="w-full bg-sidebar rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
        <div className="relative">
          <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5" />
          <Input
            placeholder="Rechercher..."
            value={table.getColumn("from_sdl")?.getFilterValue() ?? ""}
            onChange={(event) => table.getColumn("from_sdl")?.setFilterValue(event.target.value)}
            className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
          />
        </div>
        <div className="flex flex-row justify-between gap-x-3">
          <ExportButton />
        </div>
      </div>
      <div className="grid w-full [&>div]:border [&>div]:rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="sticky top-0 bg-background z-10 hover:bg-background">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">Pas de données</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
        <PaginationContent
          datapaginationlimit={onLimitChange}
          currentPage={resolvedCurrentPage}
          totalPages={resolvedTotalPages}
          onPageChange={onPageChange}
          pointer={resolvedPointer}
          totalCount={totalCount}
          onLimitChange={onLimitChange}
          limit={resolvedLimit}
        />
      </div>
    </div>
  );
}
