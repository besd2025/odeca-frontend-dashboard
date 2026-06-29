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

// Données : qualités de café vert classées par nombre de taxations émises
const qualitesTaxation = [
  { id: 1, qualite: "15+", denomination: "Grade A / Specialty", nb_taxations: 38 },
  { id: 2, qualite: "FW", denomination: "Fully Washed", nb_taxations: 27 },
  { id: 3, qualite: "SW", denomination: "Semi Washed", nb_taxations: 18 },
  { id: 4, qualite: "TT", denomination: "Triés/Tailles", nb_taxations: 12 },
  { id: 5, qualite: "PC", denomination: "Parche Classique", nb_taxations: 9 },
  { id: 6, qualite: "Brisures", denomination: "Brisures / Déchet", nb_taxations: 4 },
];

const badgeStyle = {
  Specialty: "bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border-purple-200",
  Standard: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200",
  Inférieur: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200",
  Rejet: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200",
};

export default function QualitesTaxationTable() {
  return (
    <Card className="p-4">
      <CardTitle className="font-bold text-lg">Qualités par Nombre de Taxations</CardTitle>
      <CardDescription className="text-muted-foreground text-sm mb-3">
        Classement des qualités de café selon les rapports de taxation émis
      </CardDescription>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Qualité</TableHead>
            <TableHead>Dénomination</TableHead>
            <TableHead className="text-right">Nb Taxations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qualitesTaxation.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-bold font-mono">{item.qualite}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.denomination}</TableCell>
              <TableCell className="text-right font-bold">{item.nb_taxations}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
