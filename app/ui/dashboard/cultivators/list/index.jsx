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
  ArrowUpDown,
  ArrowUpDownIcon,
  MoreHorizontal,
  Rows2,
  Rows3,
  Rows4,
  Search,
} from "lucide-react";
import * as React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import ExportButton from "@/components/ui/export_button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Filter from "../filter";
import ViewImageModal from "@/components/ui/view-image-dialog";
import Edit from "../edit";

const data = [
  {
    id: "cultivator_001",
    cultivator: {
      cultivator_code: "2530-522-7545",
      first_name: "Brave",
      last_name: "Eddy",
      image_url: "/images/logo_1.jpg",
    },
    sdl_ct: "NGome",
    society: "ODECA",
    localite: {
      province: "Buja",
      commune: "Ntahangwa",
    },
    champs: 4,
  },
  {
    id: "cultivator_002",
    cultivator: {
      cultivator_code: "2530-522-7545",
      first_name: "jaa",
      last_name: "Eddy",
      image_url: "/images/logo_1.jpg",
    },
    sdl_ct: "aa",
    society: "ODECA",
    localite: {
      province: "Buja",
      commune: "Ntahangwa",
    },
    champs: 4,
  },
  {
    id: "cultivator_003",
    cultivator: {
      cultivator_code: "2530-56833",
      first_name: "yoo",
      last_name: "Eddy",
      image_url: "/images/logo_1.jpg",
    },
    sdl_ct: "NGome",
    society: "ODECA",
    localite: {
      province: "Buja",
      commune: "Ntahangwa",
    },
    champs: 4,
  },
];

export default function CultivatorsListTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const [modalImageUrl, setModalImageUrl] = React.useState("");
  const handleImageClick = (url) => {
    setModalImageUrl(url);
    setIsImageModalOpen(true);
  };
  const columns = [
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const cultivator = row.original;

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
                  navigator.clipboard.writeText(
                    cultivator.cultivator.cultivator_code
                  )
                }
              >
                Copier code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <div>
                <Edit
                  cultivator={cultivator.cultivator}
                  sdl_ct={cultivator.sdl_ct}
                  society={cultivator.society}
                  localite={cultivator.localite}
                  champs={cultivator.champs}
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
          cultivator.first_name.toLowerCase().includes(search) ||
          cultivator.last_name.toLowerCase().includes(search) ||
          cultivator.cultivator_code.toLowerCase().includes(search)
        );
      },
      cell: ({ row }) => {
        const cultivators = row.original.cultivator;
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 overflow-hidden rounded-full cursor-pointer"
              onClick={() =>
                handleImageClick(
                  cultivators.image_url || "/img/blank-profile.png"
                )
              }
            >
              {true ? (
                <Image
                  width={80}
                  height={80}
                  src={cultivators.image_url}
                  alt="user"
                  className="size-full object-cover"
                />
              ) : (
                <Image
                  width={80}
                  height={80}
                  src="/img/blank-profile.png"
                  alt="user"
                />
              )}
            </div>
            <div>
              <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                {cultivators.last_name} {cultivators.first_name}
              </span>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                {cultivators.cultivator_code}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "sdl_ct",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full bg-sidebar p-4 rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4 ">
        <div className="relative ">
          <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 " />
          <Input
            placeholder="Rechercher..."
            value={table.getColumn("cultivator")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("cultivator")?.setFilterValue(event.target.value)
            }
            className="pl-10 flex-1  shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm"
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
      <div className="grid w-full [&>div]:max-h-[300px] [&>div]:border [&>div]:rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=" sticky top-0">
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
        <div>
          <Select>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="5" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Pagination className="">
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
          </Pagination>
        </div>
      </div>
      <ViewImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={modalImageUrl}
        alt="Cultivateur photo"
      />
    </div>
  );
}
