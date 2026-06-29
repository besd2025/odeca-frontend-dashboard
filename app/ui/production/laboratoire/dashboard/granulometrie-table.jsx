"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Données : usines de déparchage classées par quantité d'échantillons envoyés au labo
const usinesEchantillonnage = [
  { id: 1, usine: "USINE CENTRALE", localite: "NGOZI", nb_echantillons: 52, quantite_kg: 47800 },
  { id: 2, usine: "USINE SUD", localite: "GITEGA", nb_echantillons: 38, quantite_kg: 32600 },
];

const statutStyle = {
  Actif: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200",
  Saisonnier: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200",
  Inactif: "bg-slate-50 text-slate-500 dark:bg-slate-900/20 dark:text-slate-400 border-slate-200",
};

export default function UsinesEchantillonnageTable() {
  return (
    <Card className="p-4">
      <CardTitle className="font-bold text-lg">Usines par Quantité d'Échantillonnage</CardTitle>
      <CardDescription className="text-muted-foreground text-sm mb-3">
        Classement des usines de déparchage selon les échantillons soumis au laboratoire
      </CardDescription>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usine</TableHead>
            <TableHead>Localité</TableHead>
            <TableHead className="text-right">Nb Échantillons</TableHead>
            <TableHead className="text-right">Quantité (Kg)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usinesEchantillonnage.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-bold text-sm">{item.usine}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.localite}</TableCell>
              <TableCell className="text-right font-bold">{item.nb_echantillons}</TableCell>
              <TableCell className="text-right">{item.quantite_kg.toLocaleString("fr-FR")} Kg</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
