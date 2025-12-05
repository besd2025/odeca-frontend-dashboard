"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const stockLots = [
  {
    id: "LOT-2024-001",
    type: "Cerise A",
    grade: "A1",
    quantity: "15.2 T",
    entryDate: "2024-05-20",
    status: "En Stock",
  },
  {
    id: "LOT-2024-002",
    type: "Cerise B",
    grade: "B1",
    quantity: "8.0 T",
    entryDate: "2024-05-22",
    status: "En Traitement",
  },
  {
    id: "LOT-2024-003",
    type: "Cerise A",
    grade: "A2",
    quantity: "12.5 T",
    entryDate: "2024-05-25",
    status: "En Stock",
  },
  {
    id: "LOT-2024-004",
    type: "Cerise A",
    grade: "A1",
    quantity: "10.0 T",
    entryDate: "2024-05-28",
    status: "Prêt pour Export",
  },
  {
    id: "LOT-2024-005",
    type: "Cerise B",
    grade: "B2",
    quantity: "5.0 T",
    entryDate: "2024-06-01",
    status: "En Stock",
  },
];

export function StockListTable() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Liste des Lots</CardTitle>
          <CardDescription>Aperçu des lots actuellement en stock</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          Voir Tout <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lot ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Date Entrée</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockLots.map((lot) => (
              <TableRow key={lot.id}>
                <TableCell className="font-medium">{lot.id}</TableCell>
                <TableCell>{lot.type}</TableCell>
                <TableCell>{lot.grade}</TableCell>
                <TableCell>{lot.quantity}</TableCell>
                <TableCell>{lot.entryDate}</TableCell>
                <TableCell>
                  <Badge variant="outline">{lot.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
