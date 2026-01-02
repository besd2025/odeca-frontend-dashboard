"use client";

import React, { useState } from "react";
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

export default function Receptions({ data = [] }) {
  // Mock data if none provided (or replace 'data' prop usage with internal state/api call)
  const receptions =
    data.length > 0
      ? data
      : [
          {
            id: 1,
            date: "2024-05-15",
            proprietaire: "Coopérative KAWA",
            categorie: "Cerise Grade A",
            quantite: 5000,
            lot: "LOT-24-001",
            statut: "Validé",
          },
          {
            id: 2,
            date: "2024-05-16",
            proprietaire: "SOGESTAL",
            categorie: "Cerise Grade B",
            quantite: 3200,
            lot: "LOT-24-002",
            statut: "En attente",
          },
          {
            id: 3,
            date: "2024-05-18",
            proprietaire: "Coopérative KAWA",
            categorie: "Parche",
            quantite: 1500,
            lot: "LOT-24-003",
            statut: "Validé",
          },
        ];

  // Calculations for Totals
  const totalByCategorie = receptions.reduce((acc, curr) => {
    acc[curr.categorie] = (acc[curr.categorie] || 0) + curr.quantite;
    return acc;
  }, {});

  const totalByProprietaire = receptions.reduce((acc, curr) => {
    acc[curr.proprietaire] = (acc[curr.proprietaire] || 0) + curr.quantite;
    return acc;
  }, {});

  const totalPeriode = receptions.reduce((acc, curr) => acc + curr.quantite, 0);

  return (
    <div className="space-y-6">
      {/* Totals Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="">
            <CardTitle className="text-sm font-medium">Total Période</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPeriode.toLocaleString()} kg
            </div>
            <p className="text-xs text-muted-foreground">
              Toutes catégories confondues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="">
            <CardTitle className="text-sm font-medium">Par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.entries(totalByCategorie).map(([cat, qty]) => (
                <div key={cat} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{cat}:</span>
                  <span className="font-semibold">
                    {qty.toLocaleString()} kg
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Par Propriétaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.entries(totalByProprietaire).map(([prop, qty]) => (
                <div key={prop} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{prop}:</span>
                  <span className="font-semibold">
                    {qty.toLocaleString()} kg
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List Section */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Réceptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Quantité (kg)</TableHead>
                <TableHead>Lot</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receptions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="font-medium">
                    {item.proprietaire}
                  </TableCell>
                  <TableCell>{item.categorie}</TableCell>
                  <TableCell>{item.quantite.toLocaleString()}</TableCell>
                  <TableCell>{item.lot}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.statut === "Validé" ? "success" : "secondary"
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
