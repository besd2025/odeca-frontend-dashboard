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
import { AlertTriangle, truck, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Sorties({ data = [] }) {
  // Mock data
  const sorties =
    data.length > 0
      ? data
      : [
          {
            id: 1,
            date: "2024-05-20",
            proprietaire: "Coopérative KAWA",
            grade: "Grade AA",
            quantite: 5000,
            motif: "Vente",
            destination: "Client X (Belgique)",
          },
          {
            id: 2,
            date: "2024-05-21",
            proprietaire: "SOGESTAL",
            grade: "Brisures",
            quantite: 200,
            motif: "Rebut",
            destination: "Décharge",
          },
          {
            id: 3,
            date: "2024-05-22",
            proprietaire: "Coopérative KAWA",
            grade: "Grade AA",
            quantite: 12000, // Potential alert if this exceeds stock logic, but for now just data
            motif: "Transfert",
            destination: "", // Missing destination
          },
        ];

  // Aggregations
  const totalSorti = sorties.reduce((acc, curr) => acc + curr.quantite, 0);

  const byMotif = sorties.reduce((acc, curr) => {
    acc[curr.motif] = (acc[curr.motif] || 0) + curr.quantite;
    return acc;
  }, {});

  const byDestination = sorties.reduce((acc, curr) => {
    const dest = curr.destination || "Sans Destination";
    acc[dest] = (acc[dest] || 0) + curr.quantite;
    return acc;
  }, {});

  const alertsNoDest = sorties.filter((s) => !s.destination).length;
  // Placeholder logic for stock overflow
  const alertsStockOverflow = 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sorti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSorti.toLocaleString()} kg
            </div>
            <p className="text-xs text-muted-foreground">Période actuelle</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Motifs Principaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.entries(byMotif)
                .slice(0, 2)
                .map(([motif, qty]) => (
                  <div key={motif} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{motif}</span>
                    <span className="font-semibold">
                      {qty.toLocaleString()} kg
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card
          className={
            alertsNoDest > 0 ? "border-yellow-500/50 bg-yellow-50/10" : ""
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Sans Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`w-4 h-4 ${
                  alertsNoDest > 0 ? "text-yellow-500" : "text-gray-400"
                }`}
              />
              <div className="text-2xl font-bold">{alertsNoDest}</div>
            </div>
            <p className="text-xs text-muted-foreground">Alertes logistiques</p>
          </CardContent>
        </Card>

        {/* Placeholder for complex alert logic */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                Object.keys(byDestination).filter(
                  (k) => k !== "Sans Destination"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Clients/Mags distincts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* List Section */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Sorties</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Quantité (kg)</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Destination</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorties.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="font-medium">
                    {item.proprietaire}
                  </TableCell>
                  <TableCell>{item.grade}</TableCell>
                  <TableCell>{item.quantite.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.motif}</Badge>
                  </TableCell>
                  <TableCell
                    className={
                      !item.destination ? "text-yellow-600 italic" : ""
                    }
                  >
                    {item.destination || "Non spécifié"}
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
