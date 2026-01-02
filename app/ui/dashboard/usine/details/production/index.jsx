"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Production({ data = [] }) {
  // Mock data
  const production =
    data.length > 0
      ? data
      : [
          {
            id: 1,
            grade: "Grade AA",
            proprietaire: "Coopérative KAWA",
            lot: "LOT-24-001",
            quantite: 2500,
          },
          {
            id: 2,
            grade: "Grade A",
            proprietaire: "Coopérative KAWA",
            lot: "LOT-24-001",
            quantite: 1500,
          },
          {
            id: 3,
            grade: "Grade B",
            proprietaire: "Coopérative KAWA",
            lot: "LOT-24-001",
            quantite: 500,
          },
          {
            id: 4,
            grade: "Grade AA",
            proprietaire: "SOGESTAL",
            lot: "LOT-24-002",
            quantite: 1200,
          },
          {
            id: 5,
            grade: "Brisures",
            proprietaire: "SOGESTAL",
            lot: "LOT-24-002",
            quantite: 300,
          },
        ];

  // Aggregations
  const totalProduction = production.reduce(
    (acc, curr) => acc + curr.quantite,
    0
  );

  const byGrade = production.reduce((acc, curr) => {
    acc[curr.grade] = (acc[curr.grade] || 0) + curr.quantite;
    return acc;
  }, {});

  const byOwnerGrade = production.reduce((acc, curr) => {
    const key = `${curr.proprietaire} - ${curr.grade}`;
    acc[key] = (acc[key] || 0) + curr.quantite;
    return acc;
  }, {});

  const byLot = production.reduce((acc, curr) => {
    acc[curr.lot] = (acc[curr.lot] || 0) + curr.quantite;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Total Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="col-span-1 lg:col-span-4 bg-primary/10">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-medium">Total Production Usine</h3>
              <p className="text-muted-foreground">Café vert produit</p>
            </div>
            <div className="text-4xl font-bold text-primary">
              {totalProduction.toLocaleString()}{" "}
              <span className="text-lg text-muted-foreground">kg</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production par Grade */}
        <Card>
          <CardHeader>
            <CardTitle>Production par Grade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(byGrade).map(([grade, qty]) => {
              const percentage = (qty / totalProduction) * 100;
              return (
                <div key={grade} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{grade}</span>
                    <span className="text-muted-foreground">
                      {qty.toLocaleString()} kg ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Production par Lot */}
        <Card>
          <CardHeader>
            <CardTitle>Production par Lot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(byLot).map(([lot, qty]) => (
              <div
                key={lot}
                className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0"
              >
                <span className="font-medium">{lot}</span>
                <span className="font-bold">{qty.toLocaleString()} kg</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed List */}
      <Card>
        <CardHeader>
          <CardTitle>Détail Production (Par Propriétaire & Grade)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Lot</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Quantité (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {production.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.proprietaire}
                  </TableCell>
                  <TableCell>{item.lot}</TableCell>
                  <TableCell>{item.grade}</TableCell>
                  <TableCell className="text-right font-mono">
                    {item.quantite.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
