import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, FileSignature } from "lucide-react";

export default function ContractsTab({
  contracts,
  searchContract,
  setSearchContract,
}) {
  const filteredContractsList = contracts.filter(c => {
    const q = searchContract.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.lotNumber.toLowerCase().includes(q) ||
      c.buyerName.toLowerCase().includes(q) ||
      c.sellerName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-primary" /> Registre des Contrats Commercialisés
          </h2>
          <p className="text-muted-foreground text-xs">
            Saisissez les informations contractuelles des transactions d'achat et de vente basées sur les lots taxés.
          </p>
        </div>
      </div>

      <Card className="border border-border bg-card">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Liste des contrats
          </CardTitle>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher contrat, lot, acheteur..."
              value={searchContract}
              onChange={(e) => setSearchContract(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Contrat</TableHead>
                <TableHead>Lot Lié</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Café</TableHead>
                <TableHead>Parties</TableHead>
                <TableHead>Volume / Sacs</TableHead>
                <TableHead>Prix Unitaire</TableHead>
                <TableHead>Montant Total</TableHead>
                <TableHead>Date Livraison</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContractsList.map((contract) => {
                const totalAmount = contract.unitPrice * contract.quantity;
                return (
                  <TableRow key={contract.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-bold text-primary">{contract.id}</TableCell>
                    <TableCell className="font-semibold">{contract.lotNumber}</TableCell>
                    <TableCell>
                      <Badge variant={contract.contractType === "Vente" ? "default" : "secondary"}>
                        {contract.contractType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                        {contract.coffeeType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs space-y-0.5">
                      <div>
                        <span className="font-semibold text-muted-foreground">Vendeur:</span> {contract.sellerName}
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Acheteur:</span> {contract.buyerName} ({contract.buyerCountry})
                      </div>
                    </TableCell>
                    <TableCell>
                      {contract.sacsCount} sacs ({contract.quantity.toLocaleString()} kg)
                    </TableCell>
                    <TableCell className="font-semibold">{contract.unitPrice.toFixed(2)} $/kg</TableCell>
                    <TableCell className="font-bold text-foreground">
                      {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
                    </TableCell>
                    <TableCell className="text-muted-foreground">{contract.deliveryDate}</TableCell>
                    <TableCell>
                      <Badge className="bg-secondary/20 text-secondary border border-secondary/30">
                        {contract.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredContractsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground text-sm">
                    Aucun contrat enregistré.
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
