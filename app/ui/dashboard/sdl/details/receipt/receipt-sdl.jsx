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
import EditReceipts from "./edit-receipt";
import DetailsReceipt from "./details-receipt";

export default function ReceiptSdlCt({
  data = [],
  datapagination,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchValue, setSearchValue] = useState("");

  // Local pagination fallback
  const [currentPage, setCurrentPage] = useState(1);
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(10);

  const totalCount = datapagination?.totalCount ?? data.length;
  const resolvedTotalPages =
    datapagination?.totalPages ?? Math.ceil(totalCount / limit);
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
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[160px]">
              <DropdownMenuLabel className="text-muted-foreground font-normal text-xs">
                Actions
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <div>
                <DetailsReceipt data={transfer} />
              </div>

              {/* <div>
                <EditReceipts
                  from_sdl={transfer.from_sdl}
                  to_sdl_destination_name={transfer.to_sdl_destination_name}
                  society={transfer.society}
                  localite={transfer.localite}
                  qte_tranferer={transfer.qte_tranferer}
                  photo_fiche={transfer.photo_fiche}
                />
              </div> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "from_sdl",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CT Source
          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
        </Button>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const source = row.original.from_sdl ?? "";
        const target = row.original.to_sdl_destination_name ?? "";
        const search = filterValue.toLowerCase();
        return (
          source.toLowerCase().includes(search) ||
          target.toLowerCase().includes(search)
        );
      },
      cell: ({ row }) => (
        <div className="font-semibold text-foreground">{row.getValue("from_sdl")}</div>
      ),
    },

    {
      accessorKey: "society",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Société
          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue("society")}</div>,
    },
    {
      id: "localite",
      header: "Localité",
      cell: ({ row }) => {
        const localite = row.original.localite;
        return (
          <div className="text-sm text-muted-foreground">
            {localite?.commune}, {localite?.province}
          </div>
        );
      },
    },
    {
      id: "ca",
      header: "CA récus (kg)",
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.original.qte_tranferer?.ca ?? 0}
        </div>
      ),
    },
    {
      id: "cb",
      header: "CB récus (kg)",
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.original.qte_tranferer?.cb ?? 0}
        </div>
      ),
    },
    {
      id: "photo_fiche",
      header: "Fiche",
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          {row.original.photo_fiche ? (
            <ViewImageDialog
              imageUrl={row.original.photo_fiche}
              alt="Photo fiche"
              profile={false}
              className="h-8 w-8 rounded-md border shadow-xs hover:opacity-85 transition-opacity"
            />
          ) : (
            <span className="text-xs text-muted-foreground italic">-</span>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
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
    <div className="w-full bg-sidebar rounded-lg space-y-4">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full md:w-auto">
          <Search className="h-4 w-4 absolute inset-y-0 my-auto left-3 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchValue}
            onChange={(e) => {
              const val = e.target.value;
              setSearchValue(val);
              table.getColumn("from_sdl")?.setFilterValue(val);
            }}
            className="pl-9 w-full md:w-[300px] lg:w-[380px] bg-background shadow-xs rounded-lg border-border"
          />
        </div>

        <div className="flex items-center gap-3">
          <ExportButton
          //   onClickExportButton={exportCultivatorsToExcel}
          //   onClickDownloadButton={DownloadCultivatorsToExcel}
          //   loading={loadingEportBtn}
          //   activedownloadBtn={activedownloadBtn}
          />
        </div>
      </div>

      {/* Table */}
      <div className="grid w-full [&>div]:border [&>div]:rounded-lg [&>div]:overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="sticky top-0 bg-background z-10 hover:bg-background/80"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-muted-foreground text-sm font-medium"
                >
                  Aucune réception trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pt-2">
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
