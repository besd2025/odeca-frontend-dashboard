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
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

export default function Usinage({ data = [] }) {
  // Mock data
  const operations =
    data.length > 0
      ? data
      : [
          {
            id: 1,
            lot: "LOT-24-001",
            entree: 5000,
            sortie: 4200,
            pertes: 800,
            rendement: 84,
            statut: "Terminé",
          },
          {
            id: 2,
            lot: "LOT-24-002",
            entree: 3200,
            sortie: 2500,
            pertes: 700,
            rendement: 78,
            statut: "En cours",
          },
          {
            id: 3,
            lot: "LOT-24-003",
            entree: 1000,
            sortie: 850,
            pertes: 150,
            rendement: 85,
            statut: "Terminé",
          },
        ];

  // Calculations
  const completedOps = operations.filter((op) => op.statut === "Terminé");
  const avgRendement =
    completedOps.reduce((acc, curr) => acc + curr.rendement, 0) /
    (completedOps.length || 1);
  const avgPertes =
    completedOps.reduce((acc, curr) => acc + curr.pertes, 0) /
    (completedOps.length || 1);

  const lowRendementOps = operations.filter((op) => op.rendement < 80);
  const activeOps = operations.filter((op) => op.statut !== "Terminé");

  return (
    <div className="space-y-6">
      {/* Averages and Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Rendement Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-2xl font-bold">
                {avgRendement.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Sur les lots terminés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pertes Moyennes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-2xl font-bold">
                {avgPertes.toFixed(0)} kg
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Par lot terminé</p>
          </CardContent>
        </Card>

        <Card
          className={
            lowRendementOps.length > 0 ? "border-red-500/50 bg-red-50/10" : ""
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Rendement Anormal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`w-4 h-4 ${
                  lowRendementOps.length > 0 ? "text-red-500" : "text-gray-400"
                }`}
              />
              <div className="text-2xl font-bold">{lowRendementOps.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">
              Lots &lt; 80% rendement
            </p>
          </CardContent>
        </Card>

        <Card
          className={
            activeOps.length > 0 ? "border-yellow-500/50 bg-yellow-50/10" : ""
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Lots Non Clôturés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{activeOps.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">
              En cours de traitement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* List Section */}
      <Card>
        <CardHeader>
          <CardTitle>Opérations d'Usinage</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lot</TableHead>
                <TableHead>Entrée (kg)</TableHead>
                <TableHead>Sortie (kg)</TableHead>
                <TableHead>Pertes (kg)</TableHead>
                <TableHead>Rendement</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operations.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.lot}</TableCell>
                  <TableCell>{item.entree.toLocaleString()}</TableCell>
                  <TableCell>{item.sortie.toLocaleString()}</TableCell>
                  <TableCell className="text-red-500">
                    {item.pertes.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        item.rendement < 80
                          ? "text-red-500 font-bold"
                          : "text-green-600 font-bold"
                      }
                    >
                      {item.rendement}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.statut === "Terminé" ? "success" : "warning"
                      }
                    >
                      {item.statut}
                    </Badge>
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
