import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, PackageCheck, AlertCircle, MoreHorizontal } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data to replace the statics
const MOCK_GRADES = [
  { id: "fv", label: "FV", bags: 454 },
  { id: "fb", label: "FB", bags: 5 },
  { id: "pb", label: "PB", bags: 45 },
];
const MOCK_LOTS = [
  { id: "LOT-001", name: "LOT-001", },
  { id: "LOT-002", name: "LOT-002", },
  { id: "LOT-003", name: "LOT-003", },
  { id: "LOT-004", name: "LOT-004", },
]
export default function StockedList({ lots, onViewDetails, onStockGrade }) {
  const [lotsExistants, setLotsExistants] = React.useState([]);
  const [stockingGrade, setStockingGrade] = React.useState(null);
  const [bagsToStock, setBagsToStock] = React.useState("");
  const [lotNumbers, setLotNumbers] = React.useState([]);
  const [checkedTries, setCheckedTries] = React.useState({});
  const [checkedNonRequis, setCheckedNonRequis] = React.useState({});
  const [isViewingDetailsStock, setIsViewingDetailsStock] = React.useState(false);

  const handleViewDetailsStock = (lot) => {
    setIsViewingDetailsStock(true);
  };
  const handleLotChange = (value) => {
    setLotsExistants(value);
  }

  const recalculateBagsAndLots = (currentTries, currentNonRequis, currentStockingGrade = stockingGrade) => {
    const sum = MOCK_GRADES.reduce((acc, g) => {
      let total = acc;
      if (currentTries[g.id]) total += g.bags;
      if (currentNonRequis[g.id]) total += g.bags;
      return total;
    }, 0);

    setBagsToStock(String(sum));

    const numLots = sum > 0 ? Math.ceil(sum / 320) : 0;
    const prefix = currentStockingGrade ? (currentStockingGrade.id || currentStockingGrade.lotId) : "STOCK-LOT";
    const newLotNumbers = [];
    for (let i = 0; i < numLots; i++) {
      newLotNumbers.push(`${prefix}-L${String(i + 1).padStart(2, '0')}`);
    }
    setLotNumbers(newLotNumbers);
  };

  const handleOpenStocking = (gradeItem) => {
    setStockingGrade(gradeItem);
    const initialTries = {};
    const initialNonRequis = {};
    MOCK_GRADES.forEach((g) => {
      initialTries[g.id] = false;
      initialNonRequis[g.id] = false;
    });
    setCheckedTries(initialTries);
    setCheckedNonRequis(initialNonRequis);
    setBagsToStock("0");
    setLotNumbers([]);
  };

  const handleTriesToggle = (id) => {
    const updated = { ...checkedTries, [id]: !checkedTries[id] };
    setCheckedTries(updated);
    recalculateBagsAndLots(updated, checkedNonRequis, stockingGrade);
  };

  const handleNonRequisToggle = (id) => {
    const updated = { ...checkedNonRequis, [id]: !checkedNonRequis[id] };
    setCheckedNonRequis(updated);
    recalculateBagsAndLots(checkedTries, updated, stockingGrade);
  };

  const handleBagsChange = (val) => {
    setBagsToStock(val);
    const bags = parseInt(val) || 0;
    if (bags > 0) {
      const numLots = Math.ceil(bags / 320);
      setLotNumbers((prev) => {
        const next = [...prev];
        if (next.length < numLots) {
          while (next.length < numLots) next.push("");
        } else if (next.length > numLots) {
          next.length = numLots;
        }
        return next;
      });
    } else {
      setLotNumbers([]);
    }
  };

  const handleConfirmStocking = (e) => {
    e.preventDefault();
    if (!stockingGrade) return;

    const bags = parseInt(bagsToStock) || 0;
    const maxBags = stockingGrade.bags || stockingGrade.nombreSacs || 9999;
    if (bags <= 0 || bags > maxBags) {
      toast.error(`Veuillez saisir une quantité valide entre 1 et ${maxBags} sacs.`);
      return;
    }

    const numLots = Math.ceil(bags / 320);
    for (let i = 0; i < numLots; i++) {
      if (!lotNumbers[i] || !lotNumbers[i].trim()) {
        toast.error(`Veuillez renseigner le numéro de lot pour le Lot #${i + 1}.`);
        return;
      }
    }

    if (onStockGrade) {
      onStockGrade(stockingGrade.id || stockingGrade.lotId, stockingGrade.grades || stockingGrade.grade, bags, lotNumbers);
    }
    setStockingGrade(null);
  };
  return (
    <div>
      <Tabs defaultValue="account">
        <TabsList className="w-full md:w-1/2">
          <TabsTrigger value="account">Nouveau lot</TabsTrigger>
          <TabsTrigger value="password">Stock</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-primary" /> Nouveau lot
              </CardTitle>
              <CardDescription>
                Nouveau lot prets à être stockés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lots.length === 0 ? (
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
                  <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Aucun lots après triage.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Propriétaire / Société</TableHead>
                      <TableHead>Grade / Qualité</TableHead>
                      <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lots.map((lot) => (
                      <TableRow key={lot.id}>

                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {lot.societe}
                            </span>
                            {lot.sdls && lot.sdls.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {lot.sdls.map((sdl) => (
                                  <span
                                    key={sdl}
                                    className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                                  >
                                    {sdl}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {lot.grades &&
                              Object.keys(lot.grades).map((grade) => (
                                <Badge
                                  key={grade}
                                  variant="secondary"
                                  className="text-xs bg-secondary/10 text-secondary dark:bg-secondary/30 dark:text-secondary dark:border-secondary/30"
                                >
                                  {grade}
                                </Badge>
                              ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel className="text-muted-foreground font-normal text-xs">
                                Actions
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => onViewDetails(lot)}
                              >
                                Détails
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleOpenStocking(lot)}
                                className="text-primary"
                              >
                                <PackageCheck className="h-3.5 w-3.5 text-primary" /> Stocker
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <PaginationContent />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-primary" /> Lots Stockés
              </CardTitle>
              <CardDescription>
                Liste des lots de café finalisés, étiquetés et disponibles en entrepôt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lots.length === 0 ? (
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
                  <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Aucun lot stocké pour le moment
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Propriétaire / Société</TableHead>
                      <TableHead>Grade / Qualité</TableHead>
                      <TableHead className="text-right">Nombre de Sacs</TableHead>
                      <TableHead>Date de Stockage</TableHead>
                      <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lots.map((lot) => (
                      <TableRow key={lot.id}>

                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {lot.societe}
                            </span>
                            {lot.sdls && lot.sdls.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {lot.sdls.map((sdl) => (
                                  <span
                                    key={sdl}
                                    className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                                  >
                                    {sdl}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {lot.grades &&
                              Object.keys(lot.grades).map((grade) => (
                                <Badge
                                  key={grade}
                                  variant="secondary"
                                  className="text-xs bg-secondary/10 text-secondary dark:bg-secondary/30 dark:text-secondary dark:border-secondary/30"
                                >
                                  {grade}
                                </Badge>
                              ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                          {lot.nombreSacs ?? "—"}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {lot.dateStockage || "—"}
                        </TableCell>
                        <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel className="text-muted-foreground font-normal text-xs">
                                Actions
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleViewDetailsStock(lot)}
                              >
                                Détails
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <PaginationContent />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!stockingGrade} onOpenChange={(open) => !open && setStockingGrade(null)}>
        <DialogContent className="sm:max-w-xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-primary" /> Stocker le Grade
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Définir les numéros de lot et les sacs pour le stockage. 1 lot = 320 sacs.
            </DialogDescription>
          </DialogHeader>

          {stockingGrade && (
            <form onSubmit={handleConfirmStocking} className="space-y-4">
              <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg text-sm space-y-1">
                <div><span className="font-semibold text-primary">Société:</span> {stockingGrade.societe}</div>
              </div>
              <Label>Sélectionner un lot existant</Label>
              <Select
                value={lotsExistants}
                onValueChange={handleLotChange}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Sélectionner un lot" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_LOTS.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label>Combiner</Label>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <h1 className="text-md font-bold mb-2">Tries</h1>
                  <div className="space-y-2">
                    {MOCK_GRADES.map((g) => (
                      <div key={`tries-${g.id}`} className="flex items-center justify-center gap-4 bg-background/50 rounded-lg p-1">
                        <Checkbox
                          id={`tries-${g.id}`}
                          checked={checkedTries[g.id] || false}
                          onCheckedChange={() => handleTriesToggle(g.id)}
                          className="ml-2"
                        />
                        <Label htmlFor={`tries-${g.id}`} className="text-sm font-semibold cursor-pointer">
                          {g.label}
                        </Label>
                        <div className="flex flex-col">
                          <Label className="text-xs mb-0.5 text-secondary">{g.bags || 0} Sacs disponibles</Label>
                          <Input
                            type="number"
                            min="1"
                            max={g.bags || 9999}
                            placeholder="Nombre de sacs"
                            className="w-24 h-8"
                            value={g.bags}
                            onChange={(e) => handleTriesToggle(g.id)}
                            required
                          />
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h1 className="text-md font-bold text-slate-900 dark:text-white mb-2">Triage non requis</h1>
                  <div className="space-y-2">
                    {MOCK_GRADES.map((g) => (
                      <div key={`non-requis-${g.id}`} className="flex items-center gap-4 bg-background/50 rounded-lg p-1">
                        <Checkbox
                          id={`non-requis-${g.id}`}
                          checked={checkedNonRequis[g.id] || false}
                          onCheckedChange={() => handleNonRequisToggle(g.id)}
                          className="ml-2"
                        />
                        <Label htmlFor={`non-requis-${g.id}`} className="text-sm font-semibold cursor-pointer">
                          {g.label}
                        </Label>
                        <div>
                          <Label className="text-xs  mb-0.5 text-secondary">{g.bags || 0} Sacs disponibles</Label>
                          <Input
                            type="number"
                            min="1"
                            max={g.bags || 9999}
                            placeholder="Nombre de sacs"
                            className="w-24 h-8"
                            value={g.bags}
                            onChange={(e) => handleNonRequisToggle(g.id)}
                            required
                          />
                        </div></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Nombre de sacs à stocker</Label>
                <Input
                  type="number"
                  min="1"
                  max={stockingGrade.bags || stockingGrade.nombreSacs || 9999}
                  value={bagsToStock}
                  onChange={(e) => handleBagsChange(e.target.value)}
                  disabled={true}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" type="button" onClick={() => setStockingGrade(null)} size="sm">
                  Annuler
                </Button>
                <Button type="submit" className="bg-primary text-white" size="sm">
                  Enregistrer
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isViewingDetailsStock} onOpenChange={setIsViewingDetailsStock}>
        <DialogContent className="sm:max-w-2xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Details du Stock
            </DialogTitle>
          </DialogHeader>
          <div className=" gap-4">
            {/* Grades */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-900 space-y-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                Qualité (Café Vert) Stockés
              </span>
              <div className="space-y-1.5 mt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Qualité</TableHead>
                      <TableHead className="text-right">Nombre de Sacs</TableHead>
                      <TableHead>Poids Net</TableHead>
                      <TableHead>Poids Brut</TableHead>
                      <TableHead>Date de Stockage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lots.map((lot) => (
                      <TableRow key={lot.id}>
                        <TableCell>
                          grade
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                          {lot.nombreSacs ?? "—"}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                          {lot.poidsNet ?? "—"}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                          {lot.poidsBrut ?? "—"}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {lot.dateStockage || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
