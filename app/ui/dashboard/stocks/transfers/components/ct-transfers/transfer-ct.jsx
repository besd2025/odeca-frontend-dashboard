"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDownIcon, MoreHorizontal, Search, UserX } from "lucide-react";
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
import Link from "next/link";
import EditTransfers from "./edit-tranfers";
import ViewImageDialog from "@/components/ui/view-image-dialog";
// import PaginationControls from "@/components/ui/pagination-controls";
import PaginationContent from "@/components/ui/pagination-content";
import DetailsTransfer from "./details-transfer";
import { UserContext } from "@/app/ui/context/User_Context";
import { toast } from "sonner";
import { fetchData } from "@/app/_utils/api";
export default function TransferCtDep({
  data = [],
  fethTransfertbtnLoading,
  datapagination,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const user = React.useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(5);
  // const [totalCount, setTotalCount] = useState(0);

  React.useEffect(() => {
    if (typeof fethTransfertbtnLoading === "function") {
      fethTransfertbtnLoading(true);
    }
  }, [fethTransfertbtnLoading]);

  // Use pagination props from parent if available
  const totalCount = datapagination?.totalCount ?? data.length;
  const resolvedTotalPages = datapagination?.totalPages ?? Math.ceil(totalCount / limit);
  const resolvedCurrentPage = datapagination?.currentPage ?? currentPage;
  const resolvedPointer = datapagination?.pointer ?? pointer;
  const resolvedLimit = datapagination?.limit ?? limit;


  // When using server-side pagination, data is already sliced/filtered by the API
  const paginatedData = data;
  const HandleDelete = async (id, name) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const results = await fetchData("delete", `/cafe/transfer_ct_sdl/${id}/`, {
          params: {},
          additionalHeaders: {},
        });
        if (results) {
          resolve({ name });
        } else {
          reject(new Error("Erreur"));
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Suppression...",
      success: (data) => {
        setTimeout(() => window.location.reload(), 500);
        return `Le transfert de ${data.name} a été supprimé avec succès`;
      },
      error: "Erreur lors de la suppression",
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
                onClick={() => navigator.clipboard.writeText(`${transfer.id}`)}
              >
                Copier trajet
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div>
                <DetailsTransfer />
              </div>
              {user?.session?.category === "Admin" ? (
                <div>
                  <EditTransfers
                    from_ct={transfer.from_ct}
                    to_depulpeur_name={transfer.to_depulpeur_name}
                    society={transfer.society}
                    localite={transfer.localite}
                    qte_tranferer={transfer.qte_tranferer}
                    photo_fiche={transfer.photo_fiche}
                  />

                  <DropdownMenuItem
                    onClick={() => HandleDelete(transfer?.id, transfer?.from_ct)}
                    className="text-destructive"
                  >
                    Supprimer
                  </DropdownMenuItem>
                </div>
              ) : (" ")

              }

            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "from_ct",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CT Source
          <ArrowUpDownIcon />
        </Button>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const source = row.original.from_ct ?? "";
        const target = row.original.to_depulpeur_name ?? "";
        const search = filterValue.toLowerCase();
        return (
          source.toLowerCase().includes(search) ||
          target.toLowerCase().includes(search)
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("from_ct")}</div>
      ),
    },
    {
      accessorKey: "to_depulpeur_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SDL destination
          <ArrowUpDownIcon />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("to_depulpeur_name")}</div>
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
        return (
          <div className="text-sm">
            {localite?.province},{localite?.commune}
          </div>
        );
      },
    },
    {
      id: "ca",
      header: "CA transféré (kg)",
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.original.qte_tranferer?.ca ?? 0}
        </div>
      ),
    },
    {
      id: "cb",
      header: "CB transféré (kg)",
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
        <div className="text-center font-semibold">
          {row.original.photo_fiche ? (
            <ViewImageDialog
              imageUrl={row.original.photo_fiche}
              alt="Photo fiche"
              profile={false}
            />
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          <div className="flex justify-center">
            {row.original.status === true ? (
              <span className="h-3 w-3 rounded-full bg-green-500" />
            ) : (
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
            )}
          </div>
        </div>
      ),
    },
    {
      id: "date",
      header: "Date transfert",
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.original.date ?? 0}
        </div>
      ),
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
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    manualPagination: true,
  });
  const onPageChange = (pageNumber) => {
    if (datapagination?.onPageChange) {
      datapagination.onPageChange(pageNumber);
    } else {
      setCurrentPage(pageNumber);
      setPointer((pageNumber - 1) * limit);
    }
    setPagination((prev) => ({ ...prev, pageIndex: pageNumber - 1 }));
  };
  const onLimitChange = (newLimit) => {
    if (datapagination?.onLimitChange) {
      datapagination.onLimitChange(newLimit);
    } else {
      setLimit(newLimit);
      setPointer(0);
      setCurrentPage(1);
    }
    setPagination((prev) => ({ ...prev, pageSize: newLimit, pageIndex: 0 }));
  };

  return (
    <div className="w-full bg-sidebar rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4 ">
        <div className="relative ">
          <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 " />
          <Input
            placeholder="Rechercher..."
            value={table.getColumn("from_ct")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("from_ct")?.setFilterValue(event.target.value)
            }
            className="pl-10 flex-1  shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
          />
        </div>

        <div className="flex flex-row justify-between gap-x-3">
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
      <div className="grid w-full [&>div]:border [&>div]:rounded-md">
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
                  Pas de donneés
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected. */}
        </div>


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
