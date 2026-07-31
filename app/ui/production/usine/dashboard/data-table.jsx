"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { fetchData } from "@/app/_utils/api";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card";

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})


const columns = [
  {
    accessorKey: "societe",
    header: "Société",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-foreground font-semibold">
          {row.original.societe}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "poids",
    header: () => <div className="w-full text-right">Poids Total (Kg)</div>,
    cell: ({ row }) => {
      const val = Number(row.original.poids || 0);
      return (
        <div className="text-right font-semibold">
          {val.toLocaleString("fr-FR")}
        </div>
      );
    },
  },
  {
    accessorKey: "nombre_sacs",
    header: () => <div className="w-full text-right">Nombre de sacs</div>,
    cell: ({ row }) => {
      const val = Number(row.original.nombre_sacs || 0);
      return (
        <div className="text-right font-semibold">
          {val.toLocaleString("fr-FR")}
        </div>
      );
    },
  },
  {
    accessorKey: "pourcentage",
    header: () => <div className="w-full text-right">Pourcentage</div>,
    cell: ({ row }) => {
      const val = Number(row.original.pourcentage || 0);
      return (
        <div className="text-right font-bold text-primary">
          {val}%
        </div>
      );
    },
  },
]

export function DataTable({
  data: initialData
}) {
  const router = useRouter()
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const dataIds = React.useMemo(() => data?.map(({ id }) => id) || [], [data])

  React.useEffect(() => {
    const fetch = async () => {
      const response = await fetchData('get', 'cafe/stock_cafe/societe-stock-stats-detail/',
        {
          params: {
            limit: 5,
          },
        }
      )
      console.log(response)
      const results = response?.results || [];
      const newData = results.map((item, index) => {
        return {
          id: String(item?.societe_id),
          societe: item?.societe,
          poids: item?.quantite_entree || item?.poids || 0,
          nombre_sacs: item?.sacs_total || item?.nombre_sacs || 0,
          pourcentage: item?.pourcentage || 0,
        }
      })

      setData(newData)
    }
    fetch()
  }, [])




  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })


  return (
    <div className="overflow-hidden rounded-lg">

      <Card className="p-4">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <div className="flex justify-end mt-3">
        <Button
          variant="default"
          size="sm"
          onClick={() => router.push("/odeca-production/usine/societies")}
          className="flex items-center gap-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Building2 className="h-4 w-4" />
          Voir la liste
        </Button>
      </div>
    </div>

  );
}


