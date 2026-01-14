"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import PaginationControls from "@/components/ui/pagination-controls";

// Mock Data
const mockData = [
  {
    date: "01/01/2026",
    entree_poids: 500,
    plaque: "AB-123",
    bordereau: "B-001",
    sortie_poids: 200,
    a1_entree: 100,
    a1_stock: 50,
    a2_entree: 80,
    a2_stock: 40,
    a3_entree: 60,
    a3_stock: 30,
    b1_entree: 50,
    b1_stock: 25,
    b2_entree: 40,
    b2_stock: 20,
    coque_stock: 10,
    stock_total: 175,
  },
  {
    date: "02/01/2026",
    entree_poids: 600,
    plaque: "CD-456",
    bordereau: "B-002",
    sortie_poids: 300,
    a1_entree: 120,
    a1_stock: 60,
    a2_entree: 90,
    a2_stock: 45,
    a3_entree: 70,
    a3_stock: 35,
    b1_entree: 60,
    b1_stock: 30,
    b2_entree: 50,
    b2_stock: 25,
    coque_stock: 15,
    stock_total: 210,
  },
  {
    date: "03/01/2026",
    entree_poids: 450,
    plaque: "EF-789",
    bordereau: "B-003",
    sortie_poids: 150,
    a1_entree: 80,
    a1_stock: 40,
    a2_entree: 60,
    a2_stock: 30,
    a3_entree: 50,
    a3_stock: 25,
    b1_entree: 40,
    b1_stock: 20,
    b2_entree: 30,
    b2_stock: 15,
    coque_stock: 5,
    stock_total: 135,
  },
  // Février
  {
    date: "05/02/2026",
    entree_poids: 550,
    plaque: "GH-101",
    bordereau: "B-004",
    sortie_poids: 250,
    a1_entree: 110,
    a1_stock: 55,
    a2_entree: 85,
    a2_stock: 42,
    a3_entree: 65,
    a3_stock: 32,
    b1_entree: 55,
    b1_stock: 27,
    b2_entree: 45,
    b2_stock: 22,
    coque_stock: 12,
    stock_total: 190,
  },
  {
    date: "12/02/2026",
    entree_poids: 480,
    plaque: "IJ-202",
    bordereau: "B-005",
    sortie_poids: 180,
    a1_entree: 90,
    a1_stock: 45,
    a2_entree: 70,
    a2_stock: 35,
    a3_entree: 55,
    a3_stock: 27,
    b1_entree: 45,
    b1_stock: 22,
    b2_entree: 35,
    b2_stock: 17,
    coque_stock: 8,
    stock_total: 154,
  },
  // Mars
  {
    date: "10/03/2026",
    entree_poids: 700,
    plaque: "KL-303",
    bordereau: "B-006",
    sortie_poids: 350,
    a1_entree: 140,
    a1_stock: 70,
    a2_entree: 100,
    a2_stock: 50,
    a3_entree: 80,
    a3_stock: 40,
    b1_entree: 70,
    b1_stock: 35,
    b2_entree: 60,
    b2_stock: 30,
    coque_stock: 20,
    stock_total: 245,
  },
];

const MONTHS = [
  { value: "all", label: "Tous les mois" },
  { value: "01", label: "Janvier" },
  { value: "02", label: "Février" },
  { value: "03", label: "Mars" },
  { value: "04", label: "Avril" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juin" },
  { value: "07", label: "Juillet" },
  { value: "08", label: "Août" },
  { value: "09", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" },
];

export default function MouvementMagasinTable() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filtrage
  const filteredData = mockData.filter((item) => {
    if (selectedMonth === "all") return true;
    const itemMonth = item.date.split("/")[1];
    return itemMonth === selectedMonth;
  });

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Rows padding if needed - here we just show what we have,
  // keeping the table height dynamic or fixed could be an option.
  // user requested generic table look, let's keep it simple.

  return (
    <Card className="rounded-2xl border shadow-sm backdrop-blur w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">
          Rapport : Mouvements Magasin du Café Parche
        </CardTitle>
        <div className="w-[180px]">
          <Select
            value={selectedMonth}
            onValueChange={(val) => {
              setSelectedMonth(val);
              setCurrentPage(1); // Reset page on filter change
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par mois" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="overflow-x-auto grid w-full [&>div]:max-h-max [&>div]:border [&>div]:rounded-md">
          <Table className="min-w-[1500px]">
            {/* Header principal */}
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-semibold text-center min-w-[100px] border-r">
                  Date
                </TableHead>
                <TableHead
                  className="font-semibold text-center border-r"
                  colSpan={1}
                >
                  Entrée
                </TableHead>
                <TableHead
                  className="font-semibold text-center border-r"
                  colSpan={3}
                >
                  Sortie
                </TableHead>
                <TableHead
                  className="font-semibold text-center border-r"
                  colSpan={2}
                >
                  A1
                </TableHead>
                <TableHead
                  className="font-semibold text-center border-r"
                  colSpan={2}
                >
                  A2
                </TableHead>
                <TableHead
                  className="font-semibold text-center border-r"
                  colSpan={2}
                >
                  A3
                </TableHead>
                <TableHead
                  className="font-semibold text-center border-r"
                  colSpan={2}
                >
                  B1
                </TableHead>
                <TableHead
                  className="font-semibold text-center border-r"
                  colSpan={2}
                >
                  B2
                </TableHead>
                <TableHead className="font-semibold text-center border-r">
                  Coque
                </TableHead>
                <TableHead className="font-semibold text-center min-w-[120px]">
                  Stock Total
                </TableHead>
              </TableRow>

              {/* Sous-entêtes */}
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="border-r"></TableHead>

                <TableHead className="text-center font-medium border-r">
                  Poids
                </TableHead>

                <TableHead className="text-center font-medium border-r">
                  Plaque
                </TableHead>
                <TableHead className="text-center font-medium border-r">
                  N° Bordereau
                </TableHead>
                <TableHead className="text-center font-medium border-r">
                  Poids
                </TableHead>

                <TableHead className="text-center font-medium border-r">
                  Entrée
                </TableHead>
                <TableHead className="text-center font-medium border-r">
                  Stock
                </TableHead>

                <TableHead className="text-center font-medium border-r">
                  Entrée
                </TableHead>
                <TableHead className="text-center font-medium border-r">
                  Stock
                </TableHead>

                <TableHead className="text-center font-medium border-r">
                  Entrée
                </TableHead>
                <TableHead className="text-center font-medium border-r">
                  Stock
                </TableHead>

                <TableHead className="text-center font-medium border-r">
                  Entrée
                </TableHead>
                <TableHead className="text-center font-medium border-r">
                  Stock
                </TableHead>

                <TableHead className="text-center font-medium border-r">
                  Entrée
                </TableHead>
                <TableHead className="text-center font-medium border-r">
                  Stock
                </TableHead>

                <TableHead className="text-center font-medium border-r">
                  Stock
                </TableHead>

                <TableHead className="text-center font-medium text-xs">
                  A+B+Coque
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <TableCell className="text-center border-r font-medium text-xs">
                      {row.date}
                    </TableCell>

                    {/* ENTREE */}
                    <TableCell className="text-center border-r text-muted-foreground">
                      {row.entree_poids}
                    </TableCell>

                    {/* SORTIE */}
                    <TableCell className="text-center border-r text-muted-foreground">
                      {row.plaque}
                    </TableCell>
                    <TableCell className="text-center border-r text-muted-foreground">
                      {row.bordereau}
                    </TableCell>
                    <TableCell className="text-center border-r text-muted-foreground">
                      {row.sortie_poids}
                    </TableCell>

                    {/* A1 */}
                    <TableCell className="text-center border-r">
                      {row.a1_entree}
                    </TableCell>
                    <TableCell className="text-center border-r font-medium text-blue-600">
                      {row.a1_stock}
                    </TableCell>

                    {/* A2 */}
                    <TableCell className="text-center border-r">
                      {row.a2_entree}
                    </TableCell>
                    <TableCell className="text-center border-r font-medium text-blue-600">
                      {row.a2_stock}
                    </TableCell>

                    {/* A3 */}
                    <TableCell className="text-center border-r">
                      {row.a3_entree}
                    </TableCell>
                    <TableCell className="text-center border-r font-medium text-blue-600">
                      {row.a3_stock}
                    </TableCell>

                    {/* B1 */}
                    <TableCell className="text-center border-r">
                      {row.b1_entree}
                    </TableCell>
                    <TableCell className="text-center border-r font-medium text-amber-600">
                      {row.b1_stock}
                    </TableCell>

                    {/* B2 */}
                    <TableCell className="text-center border-r">
                      {row.b2_entree}
                    </TableCell>
                    <TableCell className="text-center border-r font-medium text-amber-600">
                      {row.b2_stock}
                    </TableCell>

                    {/* COQUE */}
                    <TableCell className="text-center border-r font-medium">
                      {row.coque_stock}
                    </TableCell>

                    {/* STOCK TOTAL */}
                    <TableCell className="text-center font-bold bg-muted/5">
                      {row.stock_total}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={24} className="h-24 text-center">
                    Aucune donnée disponible pour cette période.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <PaginationControls
          page={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[3, 5, 10, 20]}
        />
      </CardContent>
    </Card>
  );
}
