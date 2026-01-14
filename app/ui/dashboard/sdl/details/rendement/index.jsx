"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import PaginationControls from "@/components/ui/pagination-controls";
import DetailsReceipt from "../receipt/details-receipt";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import DetailsRendement from "./details-redement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const products = [
  {
    id: 1,
    date: "12/8/2025",
    lot_num: 40,
    grade_A: { A1: 10, A2: 20, A3: 30 },
    grade_B: { B1: 10, B2: 20, B3: 30 },
    coque: 452,
    qte_total: 4455.5,
    rendement: "58%",
  },
];

export default function RedementC() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const totalItems = products.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedProducts = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [page, pageSize]);

  return (
    <Card className="w-full mt-4 rounded-2xl ">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">
          Rapport C – Rendements Cerises
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full [&>div]:max-h-max [&>div]:border [&>div]:rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Actions</TableHead>
                <TableHead>Date Emmangasinage</TableHead>
                <TableHead>No Lot</TableHead>
                <TableHead>Grade A</TableHead>
                <TableHead>Grade B</TableHead>
                <TableHead>Coque</TableHead>
                <TableHead>Qte TOTAL</TableHead>
                <TableHead>Rendement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id} className="odd:bg-mu/ted/50">
                  <TableCell className="pl-4" asChild>
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

                        <div>
                          <DetailsRendement />
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  <TableCell className="font-medium">{product.date}</TableCell>
                  <TableCell>{product.lot_num}</TableCell>
                  <TableCell className="bg-primary/20">
                    <div className="flex flex-col gap-y-2">
                      <span>
                        A1: {product.grade_A.A1}{" "}
                        <span className="text-xs normal-case">Kg</span>
                      </span>
                      <span>
                        A2: {product.grade_A.A2}{" "}
                        <span className="text-xs normal-case">Kg</span>
                      </span>
                      <span>
                        A3: {product.grade_A.A3}{" "}
                        <span className="text-xs normal-case">Kg</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="bg-secondary/20">
                    {" "}
                    <div className="flex flex-col gap-y-2">
                      <span>
                        B1: {product.grade_B.B1}{" "}
                        <span className="text-xs normal-case">Kg</span>
                      </span>
                      <span>
                        B2: {product.grade_B.B2}{" "}
                        <span className="text-xs normal-case">Kg</span>
                      </span>
                      <span>
                        B3: {product.grade_B.B3}{" "}
                        <span className="text-xs normal-case">Kg</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="bg-accent">
                    {product.coque}{" "}
                    <span className="text-xs normal-case">Kg</span>
                  </TableCell>
                  <TableCell>{product.qte_total} Kg</TableCell>
                  <TableCell>{product.rendement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <PaginationControls
          className="mt-4"
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPage(1);
            setPageSize(size);
          }}
          hasNextPage={page < totalPages}
          hasPreviousPage={page > 1}
        />
      </CardContent>
    </Card>
  );
}
