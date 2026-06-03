"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Tag, Clipboard, Inbox, Calendar, User, FileText, ArrowRight, Truck, CheckCircle, Search, Trash2, ShieldAlert } from "lucide-react";

// ==========================================
// MOCKED DATA (ILLUSTRATION POUR LE DESIGN)
// ==========================================
const initialPendingSamples = [
  {
    id: "ECH-2026-001",
    lotNumber: "LOT-2026-001",
    societe: "COCOCA",
    deparcheur: "Usine Ngozi SOGESTAL",
    sacsCount: 150,
    qtePrelevee: 15000, // en grammes (15 kg)
    dateEchantillonnage: "2026-05-25",
    echantillonneur: "Jean Nkurunziza"
  },
  {
    id: "ECH-2026-002",
    lotNumber: "LOT-2026-002",
    societe: "BURUNDI SPECIALTY COFFEE",
    deparcheur: "Usine Gitega SOGESTAL",
    sacsCount: 320,
    qtePrelevee: 32000, // en grammes (32 kg)
    dateEchantillonnage: "2026-05-26",
    echantillonneur: "Alice Harriman"
  },
  {
    id: "ECH-2026-003",
    lotNumber: "LOT-2026-003",
    societe: "KIBIRA COFFEE",
    deparcheur: "Usine Kayanza SOGESTAL",
    sacsCount: 85,
    qtePrelevee: 8500, // en grammes (8.5 kg)
    dateEchantillonnage: "2026-05-27",
    echantillonneur: "Pierre Nkurunziza"
  }
];

const initialLabAnalyses = [
  {
    id: "LAB-ANA-1",
    sampleId: "ECH-2026-004",
    transfertEchantillon: "Par coursier Ngozi",
    lotNumber: "LOT-2026-004",
    qteEchantillon: 15.0, // kg
    sacsCount: 120,
    societe: "COPROCA",
    deparcheur: "Usine Ngozi SOGESTAL",
    echantillonneur: "Jean Nkurunziza",
    receptionniste: "Marc Ndayishimiye",
    codeEtiquette: "LAB-ETQ-26-004-9843",
    dateReception: "2026-05-28",
    status: "receptionne",
    createdAt: "2026-05-28T10:00:00.000Z"
  },
  {
    id: "LAB-ANA-2",
    sampleId: "ECH-2026-005",
    transfertEchantillon: "Chauffeur ODECA",
    lotNumber: "LOT-2026-005",
    qteEchantillon: 24.5, // kg
    sacsCount: 200,
    societe: "KAWASE COFFEE",
    deparcheur: "Usine Gitega SOGESTAL",
    echantillonneur: "Alice Harriman",
    receptionniste: "Jean-Marie Vianney",
    codeEtiquette: "LAB-ETQ-26-005-2311",
    dateReception: "2026-05-29",
    status: "granulometrie_complete",
    createdAt: "2026-05-29T11:00:00.000Z"
  }
];

export default function ReceptionComponent() {
  const [samples, setSamples] = useState(initialPendingSamples);
  const [labAnalyses, setLabAnalyses] = useState(initialLabAnalyses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchPendingQuery, setSearchPendingQuery] = useState("");

  const [formData, setFormData] = useState({
    transfertEchantillon: "",
    lotNumber: "",
    qteEchantillon: "",
    sacsCount: "",
    societe: "",
    deparcheur: "",
    echantillonneur: "",
    receptionniste: "",
    codeEtiquette: "",
    dateReception: new Date().toISOString().split("T")[0],
  });

  // ==============================================================
  // BRANCHEMENT BACKEND : Charger les données depuis le serveur
  // ==============================================================
  useEffect(() => {
    // POUR LE BACKEND : Charger les échantillons physiques en attente et l'historique
    /*
    async function fetchData() {
      try {
        const samplesRes = await fetch("/api/production/samples/pending-reception");
        const samplesData = await samplesRes.json();
        setSamples(samplesData);

        const analysesRes = await fetch("/api/production/laboratoire/analyses");
        const analysesData = await analysesRes.json();
        setLabAnalyses(analysesData);
      } catch (err) {
        console.error("Erreur de chargement des données", err);
      }
    }
    fetchData();
    */
  }, []);

  // Filter out samples already received in the lab (if any)
  const receivedSampleIds = labAnalyses.map((analysis) => analysis.sampleId);
  const pendingSamples = samples.filter((sample) => !receivedSampleIds.includes(sample.id));

  // Open modal for a specific pending sample
  const handleOpenConfirmModal = (sample) => {
    setSelectedSample(sample);

    // Auto-generate anonymous label code: LAB-ETQ-26-XXXXX
    const numericPart = sample.id.split("-").pop() || Math.floor(100 + Math.random() * 900).toString();
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
    const codeEtiquette = `LAB-ETQ-26-${numericPart}-${randomPart}`;

    // Convert quantity from grams to kilograms if it is large, or display directly
    const qtyInKg = sample.qtePrelevee ? (sample.qtePrelevee / 1000).toFixed(2) : "0.00";

    setFormData({
      transfertEchantillon: "",
      lotNumber: sample.lotNumber || "",
      qteEchantillon: qtyInKg,
      sacsCount: sample.sacsCount || "",
      societe: sample.societe || "",
      deparcheur: sample.deparcheur || "",
      echantillonneur: sample.echantillonneur || "",
      receptionniste: "",
      codeEtiquette: codeEtiquette,
      dateReception: new Date().toISOString().split("T")[0],
    });

    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSample) {
      toast.error("Échantillon invalide.");
      return;
    }
    if (!formData.transfertEchantillon) {
      toast.error("Veuillez renseigner le transfert de l'échantillon.");
      return;
    }
    if (!formData.receptionniste) {
      toast.error("Veuillez renseigner le nom du réceptionniste.");
      return;
    }

    const newAnalysis = {
      id: `LAB-ANA-${Date.now()}`,
      sampleId: selectedSample.id,
      transfertEchantillon: formData.transfertEchantillon,
      lotNumber: formData.lotNumber,
      qteEchantillon: parseFloat(formData.qteEchantillon),
      sacsCount: parseInt(formData.sacsCount) || 0,
      societe: formData.societe,
      deparcheur: formData.deparcheur,
      echantillonneur: formData.echantillonneur,
      receptionniste: formData.receptionniste,
      codeEtiquette: formData.codeEtiquette,
      dateReception: formData.dateReception,
      status: "receptionne",
      createdAt: new Date().toISOString(),
    };

    // ==============================================================
    // BRANCHEMENT BACKEND : Enregistrer la réception sur le serveur
    // ==============================================================
    /*
    async function submitReception() {
      try {
        const res = await fetch("/api/production/laboratoire/receptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAnalysis)
        });
        if (res.ok) {
          toast.success("Échantillon réceptionné et codé avec succès !");
        }
      } catch (err) {
        toast.error("Erreur serveur lors de la réception.");
      }
    }
    submitReception();
    */

    setLabAnalyses([newAnalysis, ...labAnalyses]);
    toast.success("Échantillon réceptionné et codé avec succès ! (Illustration locale)");
    setIsModalOpen(false);
    setSelectedSample(null);
  };

  const handleDeleteAnalysis = (id) => {
    // ==============================================================
    // BRANCHEMENT BACKEND : Supprimer l'analyse sur le serveur
    // ==============================================================
    /*
    async function deleteReception() {
      try {
        const res = await fetch(`/api/production/laboratoire/receptions/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          toast.success("Enregistrement de laboratoire supprimé");
        }
      } catch (err) {
        toast.error("Erreur serveur lors de la suppression.");
      }
    }
    deleteReception();
    */

    setLabAnalyses(labAnalyses.filter((item) => item.id !== id));
    toast.success("Enregistrement de laboratoire supprimé (Illustration locale)");
  };

  const filteredAnalyses = labAnalyses.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.codeEtiquette.toLowerCase().includes(query) ||
      item.lotNumber.toLowerCase().includes(query) ||
      item.societe.toLowerCase().includes(query) ||
      item.receptionniste.toLowerCase().includes(query)
    );
  });

  const filteredPending = pendingSamples.filter((sample) => {
    const query = searchPendingQuery.toLowerCase();
    return (
      sample.id.toLowerCase().includes(query) ||
      sample.lotNumber.toLowerCase().includes(query) ||
      sample.societe.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">

      {/* 1. Pending Physical Samples Section */}
      <Card className="shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 p-6">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Inbox className="h-5 w-5 text-primary" /> 📥 Échantillons en Attente de Réception
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Liste des prélèvements physiques effectués en usine et prêtes à être codés au laboratoire.
            </CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher prélèvement, lot..."
              value={searchPendingQuery}
              onChange={(e) => setSearchPendingQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredPending.length === 0 ? (
            <div className="text-center p-12 text-slate-500 dark:text-slate-400">
              <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Tous les échantillons ont été réceptionnés !</p>
              <p className="text-xs text-slate-400 mt-1">Aucun nouveau prélèvement en attente.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">ID Prélèvement</TableHead>
                    <TableHead>Numéro de Lot</TableHead>
                    <TableHead>Société / Propriétaire</TableHead>
                    <TableHead>Déparcheur / Usine</TableHead>
                    <TableHead className="text-right">Sacs</TableHead>
                    <TableHead className="text-right">Volume Prélevé</TableHead>
                    <TableHead>Date Prélèvement</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPending.map((sample) => (
                    <TableRow key={sample.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <TableCell className="pl-6 font-semibold">{sample.id}</TableCell>
                      <TableCell className="font-bold text-slate-700 dark:text-slate-300">{sample.lotNumber}</TableCell>
                      <TableCell>{sample.societe}</TableCell>
                      <TableCell className="text-xs text-slate-500">{sample.deparcheur}</TableCell>
                      <TableCell className="text-right">{sample.sacsCount} sacs</TableCell>
                      <TableCell className="text-right font-semibold">{(sample.qtePrelevee / 1000).toFixed(2)} kg</TableCell>
                      <TableCell className="text-xs text-slate-500">{sample.dateEchantillonnage}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          size="xs"
                          onClick={() => handleOpenConfirmModal(sample)}
                          className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Confirmer Réception
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Received Samples History Section */}
      <Card className="shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 p-6">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Clipboard className="h-5 w-5 text-primary" /> 📋 Historique des Échantillons Réceptionnés
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Registre des codages à l'aveugle et des réceptions d'échantillons au laboratoire.
            </CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher étiquette, lot, propriétaire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAnalyses.length === 0 ? (
            <div className="text-center p-12 text-slate-500 dark:text-slate-400">
              <Tag className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="font-medium">Aucun échantillon réceptionné pour le moment.</p>
              <p className="text-xs text-slate-400 mt-1">Validez un prélèvement d'usine ci-dessus.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Code Étiquette (Anonyme)</TableHead>
                    <TableHead>Numéro de Lot</TableHead>
                    <TableHead>Société / Propriétaire</TableHead>
                    <TableHead>Transfert</TableHead>
                    <TableHead className="text-right">Quantité</TableHead>
                    <TableHead>Réceptionniste</TableHead>
                    <TableHead>Date Réception</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnalyses.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <TableCell className="pl-6 font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                        {item.codeEtiquette}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-700 dark:text-slate-300">{item.lotNumber}</TableCell>
                      <TableCell>{item.societe}</TableCell>
                      <TableCell className="text-xs text-slate-500">{item.transfertEchantillon}</TableCell>
                      <TableCell className="text-right font-semibold">{item.qteEchantillon.toFixed(2)} kg</TableCell>
                      <TableCell className="text-xs">{item.receptionniste}</TableCell>
                      <TableCell className="text-xs text-slate-500 whitespace-nowrap">{item.dateReception}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          item.status === "receptionne" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                            item.status === "granulometrie_complete" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                              item.status === "triage_complete" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                item.status === "degustation_complete" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                                  item.status === "finalise_taxe" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                    "bg-red-500/10 text-red-500 border-red-500/20"
                        }>
                          {item.status === "receptionne" ? "Réceptionné (Attente Granulo)" :
                            item.status === "granulometrie_complete" ? "Granulométrie Complétée" :
                              item.status === "triage_complete" ? "Triage Manuel Complété" :
                                item.status === "degustation_complete" ? "Dégustation Complétée" :
                                  item.status === "finalise_taxe" ? "Rapport Taxation Généré" :
                                    "Retourné à l'usine"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAnalysis(item.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Confirm Check-in Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Tag className="h-6 w-6 text-primary" /> Réceptionner & Coder l'Échantillon
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Validez la réception du prélèvement physique et attribuez un code anonyme à l'échantillon.
            </DialogDescription>
          </DialogHeader>

          {selectedSample && (
            <form onSubmit={handleSubmit} className="space-y-6 pt-4 text-slate-950 dark:text-white">

              {/* Prefilled Factory Metadata */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">ID Prélèvement</span>
                  <span className="font-bold">{selectedSample.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Numéro de Lot</span>
                  <span className="font-bold">{selectedSample.lotNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Propriétaire / Société</span>
                  <span className="font-semibold">{selectedSample.societe}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Usine de déparchage</span>
                  <span className="font-semibold">{selectedSample.deparcheur}</span>
                </div>
                <div className="col-span-2 border-t border-slate-100 dark:border-slate-800/80 pt-2 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase">Volume total représenté</span>
                    <span>{selectedSample.sacsCount} sacs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold uppercase">Échantillonneur</span>
                    <span>{selectedSample.echantillonneur}</span>
                  </div>
                </div>
              </div>

              {/* Lab Specific Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label htmlFor="transfertEchantillon" className="font-bold text-slate-700 dark:text-slate-300">
                    Transfert de l’échantillon
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      id="transfertEchantillon"
                      name="transfertEchantillon"
                      value={formData.transfertEchantillon}
                      onChange={handleChange}
                      placeholder="Ex: Par coursier Ngozi, Chauffeur, coursier ODECA..."
                      className="pl-10 text-slate-950 dark:text-white"
                      required
                    />
                    <Truck className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qteEchantillon" className="font-bold text-slate-700 dark:text-slate-300">
                    Quantité de l’échantillon (kg)
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      id="qteEchantillon"
                      name="qteEchantillon"
                      value={formData.qteEchantillon}
                      onChange={handleChange}
                      className="pl-10 text-slate-950 dark:text-white"
                      required
                    />
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receptionniste" className="font-bold text-slate-700 dark:text-slate-300">
                    Réceptionniste
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      id="receptionniste"
                      name="receptionniste"
                      value={formData.receptionniste}
                      onChange={handleChange}
                      placeholder="Nom de l'agent de garde"
                      className="pl-10 text-slate-950 dark:text-white"
                      required
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateReception" className="font-bold text-slate-700 dark:text-slate-300">
                    Date de réception
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      id="dateReception"
                      name="dateReception"
                      value={formData.dateReception}
                      onChange={handleChange}
                      className="pl-10 text-slate-950 dark:text-white"
                      required
                    />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {/* Anonymous Label Code generated */}
                <div className="space-y-2">
                  <Label className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Clipboard className="h-4 w-4" /> Code Étiquette Généré (Anonyme)
                  </Label>
                  <Input
                    type="text"
                    value={formData.codeEtiquette}
                    readOnly
                    className="bg-emerald-50/30 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-bold select-all tracking-wider font-mono"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 text-blue-800 dark:text-blue-300 text-xs">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  Ce code étiquette anonymisé est le seul identifiant transmis aux techniciens de test. La traçabilité lot-société restera cryptée jusqu'à la taxation finale.
                </p>
              </div>

              <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  Confirmer & Coder l'Échantillon
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
