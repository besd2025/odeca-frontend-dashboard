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
import Filter from "../filter";
import Edit from "../edit";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import PaginationControls from "@/components/ui/pagination-controls";
import { fetchData } from "@/app/_utils/api";
import { TableSkeleton } from "@/components/ui/skeletons";

export default function CtsListTable({ isLoading: externalLoading }) {
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

  React.useEffect(() => {
    const getSdls = async () => {
      setLoading(true);
      try {
        const response = await fetchData("get", "cafe/centres_transite/", {
          params: {},
          additionalHeaders: {},
          body: {},
        });
        const results = response?.results;
        const ctData = results.map((ct) => ({
          id: ct?.id,
          ct: {
            ct_code: ct?.sdl?.sdl_code,
            ct_name: ct?.ct_nom,
            type: "",
          },
          society: ct?.sdl?.societe?.nom_societe,
          responsable: {
            first_name: ct?.ct_responsable?.user?.first_name || "",
            last_name: ct?.ct_responsable?.user?.last_name || "",
            telephone: ct?.ct_responsable?.user?.phone || "",
          },
          localite: {
            province:
              ct?.ct_adress?.zone_code?.commune_code?.province_code
                ?.province_name || "",
            commune: ct?.ct_adress?.zone_code?.commune_code?.commune_name,
          },
        }));

        setData(ctData);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getSdls();
  }, []);

  const columns = [
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const ct = row.original;
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
                onClick={() => navigator.clipboard.writeText(ct.ct.ct_code)}
              >
                Copier code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href={`/odeca-dashboard/ct/details/?id=${ct.id}`}>
                <DropdownMenuItem>Details</DropdownMenuItem>
              </Link>
              <div>
                <Edit id={ct.id} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "ct",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CT
            <ArrowUpDownIcon />
          </Button>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const ct = row.original.ct;
        if (!filterValue) return true;
        const search = filterValue.toLowerCase();
        return (
          ct.ct_name.toLowerCase().includes(search) ||
          ct.ct_code.toLowerCase().includes(search)
        );
      },
      cell: ({ row }) => {
        const cts = row.original.ct;
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 text-gray-500"
              >
                <path
                  fillRule="evenodd"
                  d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="relative w-max flex">
              <div>
                <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                  {cts.ct_name}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400 mt-2">
                  {cts.ct_code}
                </span>
              </div>
              <Badge className="size-max ml-2 text-xs">CT</Badge>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "society",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Société
            <ArrowUpDownIcon />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("society")}</div>
      ),
    },
    {
      id: "localite",
      header: "Localité",
      cell: ({ row }) => {
        const localite = row.original.localite;
        return (
          <div className="text-sm">
            {localite?.province},{localite?.commune}
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
            <span>
              {responsable?.first_name} {responsable?.last_name}
            </span>
            <span className="flex flex-row gap-x-2 text-accent-foreground/70">
              <Phone size={18} />
              {responsable?.telephone}
            </span>
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
                placeholder="Rechercher..."
                value={table.getColumn("ct")?.getFilterValue() ?? ""}
                onChange={(event) =>
                  table.getColumn("ct")?.setFilterValue(event.target.value)
                }
                className="pl-10 h-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none focus-visible:ring-0"
              />
            </div>

            <div className="flex flex-row justify-between gap-x-3">
              <div className="flex items-center gap-3">
                <Filter />
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <ExportButton
                //   onClickExportButton={exportCtsToExcel}
                //   onClickDownloadButton={DownloadCtsToExcel}
                //   loading={loadingEportBtn}
                //   activedownloadBtn={activedownloadBtn}
                />
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
