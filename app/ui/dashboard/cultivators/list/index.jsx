"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDownIcon,
  MoreHorizontal,
  Search,
  ShieldUser,
  User,
  Users,
  UserStar,
} from "lucide-react";
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
import ViewImageDialog from "@/components/ui/view-image-dialog";
import Edit from "../edit";
import Link from "next/link";
import PaginationControls from "@/components/ui/pagination-controls";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DataTable({ data, isCultivatorsPage }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const columns = [
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const result = row.original;
        const cultivator = row.original?.cultivator;
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
                onClick={() =>
                  navigator.clipboard.writeText(cultivator?.cultivator_code)
                }
              >
                Copier code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link
                href={`/odeca-dashboard/cultivators/profile/?id=${result?.id}`}
              >
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <div>
                <Edit
                  cultivator={result?.id}
                  sdl_ct={cultivator?.sdl_ct}
                  society={cultivator?.society}
                  localite={cultivator?.localite}
                  champs={cultivator?.champs}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "cultivator",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cafeiculteur
            <ArrowUpDownIcon />
          </Button>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const cultivator = row.original.cultivator;
        if (!filterValue) return true;
        const search = filterValue.toLowerCase();
        return (
          (cultivator?.first_name || "").toLowerCase().includes(search) ||
          (cultivator?.last_name || "").toLowerCase().includes(search) ||
          (cultivator?.cultivator_code || "").toLowerCase().includes(search) ||
          (cultivator?.cultivator_assoc_name || "")
            .toLowerCase()
            .includes(search)
        );
      },
      cell: ({ row }) => {
        const cultivators = row.original.cultivator;
        const isAssociation = !!cultivators?.cultivator_assoc_name;

        return (
          <div className="flex items-center gap-3">
            <ViewImageDialog
              imageUrl={cultivators?.image_url || null}
              alt={
                isAssociation
                  ? cultivators?.cultivator_assoc_name
                  : `${cultivators?.last_name} ${cultivators?.first_name}`
              }
            />
            <div>
              <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                {isAssociation
                  ? cultivators?.cultivator_assoc_name
                  : `${cultivators?.last_name} ${cultivators?.first_name}`}
              </span>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                {isAssociation ? (
                  <span className="flex items-center">
                    <ShieldUser size={18} /> rep:{" "}
                    {cultivators?.cultivator_assoc_rep_name}
                  </span>
                ) : (
                  cultivators?.cultivator_code
                )}
              </span>
            </div>
          </div>
        );
      },
    },
    ...(isCultivatorsPage
      ? [
          {
            accessorKey: "sdl_ct",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  SDL/CT
                  <ArrowUpDownIcon />
                </Button>
              );
            },
            cell: ({ row }) => <div>{row.getValue("sdl_ct")}</div>,
          },
          {
            accessorKey: "society",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
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
        ]
      : []),

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
      accessorKey: "champs",
      header: "Champs",
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.getValue("champs")}
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
    <div className="w-full bg-sidebar p-2 rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4 ">
        <div className="relative ">
          <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 " />
          <Input
            placeholder="Rechercher..."
            value={table.getColumn("cultivator")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("cultivator")?.setFilterValue(event.target.value)
            }
            className="pl-10 flex-1  shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
          />
        </div>

        <div className="flex flex-row justify-between gap-x-3">
          <div className="flex items-center gap-3">
            <Filter />
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <ExportButton
            //   onClickExportButton={exportCultivatorsToExcel}
            //   onClickDownloadButton={DownloadCultivatorsToExcel}
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
    </div>
  );
}

export default function CultivatorsListTable({
  data,
  individualData,
  associationData,
  isCultivatorsPage,
}) {
  const individuals = individualData ?? data ?? [];
  const associations = associationData ?? [];

  return (
    <Tabs defaultValue="individual" className="w-full mt-4">
      <TabsList className="p-0 h-auto bg-background gap-1">
        <TabsTrigger
          value="individual"
          className="data-[state=active]:shadow-[0_0_8px_1px_rgba(0,0,0,0.1)] dark:data-[state=active]:shadow-[0_0_8px_1px_rgba(255,255,255,0.2)]"
        >
          <User />
          Individuels
        </TabsTrigger>
        <TabsTrigger
          value="association"
          className="data-[state=active]:shadow-[0_0_8px_1px_rgba(0,0,0,0.1)] dark:data-[state=active]:shadow-[0_0_8px_1px_rgba(255,255,255,0.2)]"
        >
          <Users />
          Associations / Coopératives
        </TabsTrigger>
      </TabsList>

      <TabsContent value="individual" className="mt-4">
        <DataTable data={individuals} isCultivatorsPage={isCultivatorsPage} />
      </TabsContent>
      <TabsContent value="association" className="mt-4">
        <DataTable data={associations} isCultivatorsPage={isCultivatorsPage} />
      </TabsContent>
    </Tabs>
  );
}
