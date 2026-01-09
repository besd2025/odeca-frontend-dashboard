"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDownIcon, MoreHorizontal, Phone, Search } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/app/_utils/api";
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
import Filter from "../filter";
import Edit from "../edit";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import PaginationControls from "@/components/ui/pagination-controls";
import { TableSkeleton } from "@/components/ui/skeletons";

export default function UsineListTable({ isLoading: externalLoading }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const isActuallyLoading = externalLoading ?? loading;

  useEffect(() => {
    const getUsines = async () => {
      setLoading(true);
      try {
        const response = await fetchData("get", "cafe/usine_deparchage/", {});
        const results = response?.results || [];
        const sdlData = results.map((usine) => ({
          id: usine?.id,
          sdl: {
            sdl_code: usine?.usine_code,
            sdl_name: usine?.usine_name,
          },
          // society: sdl?.societe?.nom_societe || "", // Assuming Usines might verify society
          responsable: {
            first_name: usine?.usine_responsable?.user?.first_name || "",
            last_name: usine?.usine_responsable?.user?.last_name || "",
            telephone: usine?.usine_responsable?.user?.phone || "",
          },
          localite: {
            province:
              usine?.usine_adress?.zone_code?.commune_code?.province_code
                ?.province_name || "",
            commune:
              usine?.usine_adress?.zone_code?.commune_code?.commune_name || "",
            zone: usine?.sdl_adress?.zone_code?.zone_name || "",
          },
        }));

        setData(sdlData);
      } catch (error) {
        console.error("Error fetching sdl data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsines();
  }, []);

  const columns = [
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const sdl = row.original;

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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(sdl.sdl.sdl_code)}
              >
                Copier code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href={`/odeca-dashboard/usine/details/?id=${sdl?.id}`}>
                <DropdownMenuItem>Details</DropdownMenuItem>
              </Link>
              <div>
                <Edit id={sdl.id} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "sdl",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nom Usine
            <ArrowUpDownIcon />
          </Button>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const sdl = row.original.sdl;
        if (!filterValue) return true;
        const search = filterValue.toLowerCase();
        return (
          sdl.sdl_name.toLowerCase().includes(search) ||
          sdl.sdl_code.toLowerCase().includes(search)
        );
      },
      cell: ({ row }) => {
        const sdl = row.original.sdl;
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 text-gray-500"
              >
                <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
                <path
                  fillRule="evenodd"
                  d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z"
                  clipRule="evenodd"
                />
                <path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" />
              </svg>
            </div>

            <div className="relative w-max flex flex-col">
              <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                {sdl.sdl_name}
              </span>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                {sdl.sdl_code}
              </span>
            </div>
            <Badge className="size-max ml-2 text-xs">USINE</Badge>
          </div>
        );
      },
    },
    {
      id: "localite",
      header: "Adresse",
      cell: ({ row }) => {
        const localite = row.original.localite;
        return (
          <div className="text-sm">
            <span className="block font-medium">{localite?.province}</span>
            <span className="text-muted-foreground">
              {localite?.commune}, {localite?.zone}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "responsable",
      header: "Responsable",
      cell: ({ row }) => {
        const responsable = row.original.responsable;
        return (
          <div className="text-sm flex flex-col gap-y-1">
            <span className="font-medium">
              {responsable?.first_name} {responsable?.last_name}
            </span>
            <span className="text-xs text-muted-foreground">
              Responsable Usine
            </span>
          </div>
        );
      },
    },
    {
      id: "contact",
      header: "Contact Responsable",
      cell: ({ row }) => {
        const responsable = row.original.responsable;
        return (
          <div className="flex items-center gap-x-2 text-sm text-gray-700 dark:text-gray-300">
            <Phone size={16} className="text-gray-500" />
            {responsable?.telephone || "N/A"}
          </div>
        );
      },
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
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full bg-sidebar p-4 rounded-lg">
      {isActuallyLoading ? (
        <TableSkeleton rows={10} columns={5} />
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4 ">
            <div className="relative ">
              <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 " />
              <input
                placeholder="Rechercher Usine..."
                value={table.getColumn("sdl")?.getFilterValue() ?? ""}
                onChange={(event) =>
                  table.getColumn("sdl")?.setFilterValue(event.target.value)
                }
                className="pl-10 h-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none focus-visible:ring-0"
              />
            </div>

            <div className="flex flex-row justify-between gap-x-3">
              <div className="flex items-center gap-3">
                <Filter />
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <ExportButton />
              </div>
            </div>
          </div>
          <div className="grid w-full [&>div]:max-h-max [&>div]:border [&>div]:rounded-md">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className=" sticky top-0 bg-background z-10 hover:bg-background"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
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
        </>
      )}
    </div>
  );
}
