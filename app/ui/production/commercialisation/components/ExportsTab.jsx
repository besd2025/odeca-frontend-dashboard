import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Landmark, CheckCircle2 } from "lucide-react";

export default function ExportsTab({
  exportsList,
  searchExport,
  setSearchExport,
  onRequestExport,
}) {
  const filteredExportsList = exportsList.filter(exp => {
    const q = searchExport.toLowerCase();
    return (
      exp.id.toLowerCase().includes(q) ||
      exp.contractId.toLowerCase().includes(q) ||
      exp.exporterName.toLowerCase().includes(q) ||
      exp.lotNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" /> Déclarations et Confirmations d'Exportation
          </h2>
          <p className="text-muted-foreground text-xs">
            Soumission des justificatifs douaniers, des certificats OIC et des messages de virement Swift aux autorités BESD & ODECA.
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 shadow-sm"
          onClick={onRequestExport}
        >
          <Plus className="h-4 w-4" /> Demander Mise à l'Exploitation
        </Button>
      </div>

      <Card className="border border-border bg-card">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Suivi des exportations confirmées
          </CardTitle>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher export, contrat, exportateur..."
              value={searchExport}
              onChange={(e) => setSearchExport(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Export</TableHead>
                <TableHead>Réf. Contrat</TableHead>
                <TableHead>Lot</TableHead>
                <TableHead>Exportateur</TableHead>
                <TableHead>Logistique</TableHead>
                <TableHead>Qualité / Sacs</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Réf. Swift</TableHead>
                <TableHead>Mode E</TableHead>
                <TableHead>Vérification BESD & ODECA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExportsList.map((exp) => (
                <TableRow key={exp.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-bold text-primary">{exp.id}</TableCell>
                  <TableCell className="font-semibold text-muted-foreground">{exp.contractId}</TableCell>
                  <TableCell className="font-semibold">{exp.lotNumber}</TableCell>
                  <TableCell className="font-medium">{exp.exporterName}</TableCell>
                  <TableCell className="text-xs space-y-0.5">
                    <div>
                      <span className="font-semibold text-muted-foreground">Mode:</span> {exp.transportMode}
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground">Chauffeur/Soc:</span> {exp.carrierName}
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground">Chargement:</span> {exp.loadingDate}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-bold">{exp.quality}</div>
                    <div className="text-muted-foreground">{exp.sacsCount} sacs</div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div>
                      <span className="font-semibold text-muted-foreground">Pays:</span> {exp.oicDestinationCountry}
                    </div>
                    {exp.oicTranshipmentCountry && (
                      <div>
                        <span className="font-semibold text-muted-foreground">Transbord:</span> {exp.oicTranshipmentCountry}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-primary">{exp.swiftTransactionId}</TableCell>
                  <TableCell className="font-mono text-xs">{exp.modeE}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 flex items-center gap-1 w-max">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {exp.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredExportsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground text-sm">
                    Aucun dossier d'exportation en cours.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
