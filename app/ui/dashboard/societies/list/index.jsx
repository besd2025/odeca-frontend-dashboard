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
import { TableSkeleton } from "@/components/ui/skeletons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import EditSociety from "../edit";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import PaginationControls from "@/components/ui/pagination-controls";

export default function SocietiesListTable({ isLoading: externalLoading }) {
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
  const [filterData, setFilterData] = React.useState([]);
  const isActuallyLoading = externalLoading ?? loading;

  useEffect(() => {
    const getSocieties = async () => {
      setLoading(true);
      try {
        const response = await fetchData("get", "cafe/societes/", {});
        const results = response?.results || [];
        const societiesData = results.map((society) => ({
          id: society?.id,
          code: society?.code_societe,
          name: society?.nom_societe,
          responsable: {
            first_name: society?.responsable?.user?.first_name || "",
            last_name: society?.responsable?.user?.last_name || "",
            telephone: society?.responsable?.user?.phone || "",
          },
          localite: {
            province:
              society?.adresse?.zone_code?.commune_code?.province_code
                ?.province_name || "",
            commune:
              society?.adresse?.zone_code?.commune_code?.commune_name || "",
            zone: society?.adresse?.zone_code?.zone_name || "",
          },
        }));

        setData(societiesData);
      } catch (error) {
        console.error("Error fetching societies data:", error);
      } finally {
        setLoading(false);
      }
    };

    getSocieties();
  }, []);

  const handleFilter = (filteredData) => {
    setFilterData(filteredData);
    console.log("Filtered Data:", filteredData);
  };
  const handleExportSocieties = () => {
    // Logic to export society data
    console.log("Exporting Society Data...");
  };
  const columns = [
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const society = row.original;

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
                onClick={() => navigator.clipboard.writeText(society.code)}
              >
                Copier code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link
                href={`/odeca-dashboard/societies/details/?id=${society?.id}`}
              >
                <DropdownMenuItem>Details</DropdownMenuItem>
              </Link>
              <div>
                <EditSociety id={society.id} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "name",
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
      filterFn: (row, columnId, filterValue) => {
        const name = row.original.name;
        if (!filterValue) return true;
        const search = filterValue.toLowerCase();
        return name.toLowerCase().includes(search);
      },
      cell: ({ row }) => {
        const society = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 text-gray-500"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 2.25a.75.75 0 0 0-.75.75v18a.75.75 0 0 0 .75.75h15a.75.75 0 0 0 .75-.75V3a.75.75 0 0 0-.75-.75H4.5ZM7.5 5.25a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Zm0 4.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Zm0 4.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Zm0 4.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Zm6.75-13.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Zm0 4.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Zm0 4.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Zm0 4.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="relative w-max flex ">
              <div>
                <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                  {society.name}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400 mt-2">
                  {society.code}
                </span>
              </div>

              <Badge className="size-max ml-2 text-xs">SOCIETE</Badge>
            </div>
          </div>
        );
      },
    },
    {
      id: "localite",
      header: "Localité",
      cell: ({ row }) => {
        const localite = row.original.localite;
        return (
          <div className="text-sm">
            {localite?.commune}, {localite?.province}
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
        <TableSkeleton rows={10} columns={4} />
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4 ">
            <div className="relative ">
              <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 " />
              <input
                placeholder="Rechercher Société..."
                value={table.getColumn("name")?.getFilterValue() ?? ""}
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="pl-10 h-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none focus-visible:ring-0"
              />
            </div>

            <div className="flex flex-row justify-between gap-x-3">
              <div className="flex items-center gap-3">
                <Filter handleFilter={handleFilter} />
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <ExportButton
                  handleExportSocieties={handleExportSocieties}
                  exportType="society_data"
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
                                header.getContext(),
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
                      className="h-24 text-center"
                    >
                      Aucun résultat.
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
