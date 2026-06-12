import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TaxationTab({
  taxationReports,
  searchTaxation,
  setSearchTaxation,
  onViewDetails,
  onCreateContract,
}) {
  const filteredTaxationReports = taxationReports.filter(rep => {
    const q = searchTaxation.toLowerCase();
    return (
      rep.lotNumber.toLowerCase().includes(q) ||
      rep.codeEtiquette.toLowerCase().includes(q) ||
      rep.societe.toLowerCase().includes(q)
    );
  });

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5 text-primary" /> Rapports de Taxation du Laboratoire
          </CardTitle>
          <CardDescription>
            Consultez les résultats de taxation finale du laboratoire et liez les documents certifiés pour valider la commercialisation des lots.
          </CardDescription>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher lot, étiquette, société..."
            value={searchTaxation}
            onChange={(e) => setSearchTaxation(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Actions</TableHead>
              <TableHead>No. du Lot</TableHead>
              <TableHead>Code Étiquette</TableHead>
              <TableHead>Société</TableHead>
              <TableHead>Qualité / Grade</TableHead>
              <TableHead>Sacs (Volume)</TableHead>
              <TableHead>Note Cupping</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTaxationReports.map((report) => (
              <TableRow key={report.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="flex items-center gap-1.5 py-3">
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => onViewDetails(report)} className="cursor-pointer">
                          Détails
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onCreateContract(report)}>
                          + Contrat d'achat/vente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-foreground">{report.lotNumber}</TableCell>
                <TableCell className="font-mono text-xs tracking-wider text-muted-foreground">{report.codeEtiquette}</TableCell>
                <TableCell className="font-medium">{report.societe}</TableCell>
                <TableCell>{report.qualite}</TableCell>
                <TableCell>{report.sacsCount} sacs ({report.qteEchantillon.toFixed(1)} kg)</TableCell>
                <TableCell className="font-bold text-amber-600 dark:text-amber-500">{report.noteCupping.toFixed(2)}/100</TableCell>
              </TableRow>
            ))}
            {filteredTaxationReports.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm">
                  Aucun rapport de taxation trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
