"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  FileText, CheckCircle2, AlertCircle, Plus, Eye, Search, Landmark, Scale, Award,
  FileSignature, Building, Globe, DollarSign, Truck, UploadCloud, Link as LinkIcon,
  Check, FileCheck, ArrowRight, Printer, FolderOpen, Coins, FileSpreadsheet
} from "lucide-react";

// ==========================================
// MOCKED DATA (INITIAL STATES)
// ==========================================
const initialTaxationReports = [
  {
    id: "LAB-TAX-1",
    codeEtiquette: "LAB-ETQ-26-004-7744",
    lotNumber: "LOT-2026-004",
    societe: "COPROCA",
    deparcheur: "Usine Ngozi SOGESTAL",
    sacsCount: 100,
    qteEchantillon: 12.0,
    qualite: "FW AA (Extra)",
    status: "En attente de liaison", // "En attente de liaison" | "Lié & Taxé"
    dateReception: "2026-05-28",
    noteCupping: 84.50,
    granulometrie: {
      sieve_7_1: 42.0, sieve_6_3: 38.0, sieve_5_5: 11.0, sieve_4_0: 6.0, sieve_3_0: 2.0, fond: 1.0
    },
    triage: {
      vraisDefauts: 1.2, defectueux: 1.0, brisure: 0.8, nEtRat: 0.5, corpsEtrangers: 0.0, totalDefectPct: 3.5
    },
    degustation: {
      moyenne: 84.5,
      observation: "Excellent corps, notes florales et agrumes bien prononcées.",
      nbDegustateurs: 3,
      qualite: "FW AA"
    }
  },
  {
    id: "LAB-TAX-2",
    codeEtiquette: "LAB-ETQ-26-003-8812",
    lotNumber: "LOT-2026-003",
    societe: "KIBIRA COFFEE",
    deparcheur: "Usine Kayanza SOGESTAL",
    sacsCount: 85,
    qteEchantillon: 8.5,
    qualite: "FW NGOMA MILD-SDL",
    status: "Lié & Taxé",
    linkedDocType: "link", // "link" | "upload"
    linkedDocName: "LAB-CERT-2026-003.pdf",
    dateReception: "2026-05-30",
    noteCupping: 85.00,
    granulometrie: {
      sieve_7_1: 50.0, sieve_6_3: 30.0, sieve_5_5: 10.0, sieve_4_0: 6.0, sieve_3_0: 3.0, fond: 1.0
    },
    triage: {
      vraisDefauts: 1.5, defectueux: 2.0, brisure: 0.5, nEtRat: 1.0, corpsEtrangers: 0.0, totalDefectPct: 5.0
    },
    degustation: {
      moyenne: 85.0,
      observation: "Notes fruitées intenses, très bel équilibre, acidité vive.",
      nbDegustateurs: 3,
      qualite: "Mild Specialty"
    }
  },
  {
    id: "LAB-TAX-3",
    codeEtiquette: "LAB-ETQ-26-005-1234",
    lotNumber: "LOT-2026-005",
    societe: "KAWASE COFFEE",
    deparcheur: "Usine Gitega SOGESTAL",
    sacsCount: 200,
    qteEchantillon: 24.5,
    qualite: "FW A (Standard)",
    status: "En attente de liaison",
    dateReception: "2026-06-02",
    noteCupping: 81.20,
    granulometrie: {
      sieve_7_1: 35.0, sieve_6_3: 40.0, sieve_5_5: 15.0, sieve_4_0: 7.0, sieve_3_0: 2.0, fond: 1.0
    },
    triage: {
      vraisDefauts: 2.0, defectueux: 2.5, brisure: 1.0, nEtRat: 1.2, corpsEtrangers: 0.1, totalDefectPct: 6.8
    },
    degustation: {
      moyenne: 81.2,
      observation: "Corps moyen, notes de chocolat noir, légère amertume en fin de bouche.",
      nbDegustateurs: 3,
      qualite: "FW A"
    }
  }
];

const initialContracts = [
  {
    id: "CTR-2026-001",
    lotNumber: "LOT-2026-003",
    contractType: "Vente",
    coffeeType: "Arabica",
    sellerName: "KIBIRA COFFEE",
    sellerNif: "400012345-0",
    sellerPhone: "+257 22 25 14 56",
    buyerName: "Burundi Premium Coffee Imports LLC",
    buyerCountry: "États-Unis",
    buyerBp: "P.O. Box 7845 New York",
    buyerEmail: "import@burundipremium.com",
    buyerPhone: "+1 212 555 0199",
    unitPrice: 4.85,
    quantity: 5100, // 85 sacs * 60 kg
    deliveryDate: "2026-08-15",
    sacsCount: 85,
    tareWeight: "60 kgs",
    guaranteeAmount: 1200.00,
    guaranteeType: "Par lot",
    lotCount: 1,
    status: "Actif",
    createdAt: "2026-06-01"
  }
];

const initialExports = [
  {
    id: "EXP-2026-001",
    contractId: "CTR-2026-001",
    lotNumber: "LOT-2026-003",
    exporterName: "KIBIRA COFFEE",
    loadingDate: "2026-08-20",
    transportMode: "Camion",
    carrierName: "TRANS-AFRICA LOGISTICS",
    sacsCount: 85,
    quality: "FW NGOMA MILD-SDL",
    modeE: "EXP-MODE-E-789",
    douaneDoc: "declaration_douane_852.pdf",
    qualityCertDoc: "certificat_qualite_963.pdf",
    oicDocName: "oic_ico_cert_111.pdf",
    oicExporter: "KIBIRA COFFEE",
    oicNotifyAddress: "Burundi Premium Coffee Imports LLC, USA",
    oicDestinationCountry: "États-Unis",
    oicTranshipmentCountry: "Tanzanie",
    swiftTransactionId: "SWIFT-TXN-998811",
    swiftDoc: "swift_payment_receipt.pdf",
    exploitationDoc: "declaration_exploitation.pdf",
    contractDoc: "contrat_vente_original.pdf",
    factureDoc: "facture_commerciale_5521.pdf",
    accordVenteDoc: "accord_vente_prive.pdf",
    accordVenteQty: 5100,
    debitNoteDoc: "note_debit_0045.pdf",
    lotCount: 1,
    status: "Confirmé BESD & ODECA",
    createdAt: "2026-06-05"
  }
];

const countryList = [
  "Belgique", "Allemagne", "États-Unis", "Japon", "Suisse", "France",
  "Italie", "Royaume-Uni", "Canada", "Burundi", "Rwanda", "Kenya", "Tanzanie"
];

export default function CommercialisationComponent() {
  const [taxationReports, setTaxationReports] = useState(initialTaxationReports);
  const [contracts, setContracts] = useState(initialContracts);
  const [exportsList, setExportsList] = useState(initialExports);

  const [activeMainTab, setActiveMainTab] = useState("taxation");

  // State control for Search inputs
  const [searchTaxation, setSearchTaxation] = useState("");
  const [searchContract, setSearchContract] = useState("");
  const [searchExport, setSearchExport] = useState("");

  // Modals & Dialogue triggers
  const [selectedReport, setSelectedReport] = useState(null);
  const [isSynthModalOpen, setIsSynthModalOpen] = useState(false);

  const [reportToLink, setReportToLink] = useState(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const [isContractFormOpen, setIsContractFormOpen] = useState(false);
  const [isExportFormOpen, setIsExportFormOpen] = useState(false);

  // Link report form inputs
  const [linkMode, setLinkMode] = useState("document_link"); // "document_link" | "file_upload"
  const [selectedDocCode, setSelectedDocCode] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Contract form inputs
  const [contractForm, setContractForm] = useState({
    lotNumber: "",
    contractType: "Vente",
    coffeeType: "Arabica",
    sellerName: "",
    sellerNif: "",
    sellerPhone: "",
    buyerName: "",
    buyerCountry: "Belgique",
    buyerBp: "",
    buyerEmail: "",
    buyerPhone: "",
    unitPrice: "",
    quantity: "",
    deliveryDate: "",
    sacsCount: "",
    tareWeight: "60 kgs",
    guaranteeAmount: "",
    guaranteeType: "Par sac",
    lotCount: 1
  });

  // Export form inputs
  const [exportForm, setExportForm] = useState({
    contractId: "",
    loadingDate: "",
    transportMode: "Camion",
    carrierName: "",
    modeE: "",
    douaneDoc: "",
    qualityCertDoc: "",
    oicDoc: "",
    oicNotifyAddress: "",
    oicTranshipmentCountry: "Tanzanie",
    swiftTransactionId: "",
    swiftDoc: "",
    exploitationDoc: "",
    contractDoc: "",
    factureDoc: "",
    accordVenteDoc: "",
    accordVenteQty: "",
    debitNoteDoc: "",
    lotCount: 1
  });

  // ==========================================
  // HANDLERS
  // ==========================================

  // 1. Link / Taxation Action
  const handleOpenLinkModal = (report) => {
    setReportToLink(report);
    setSelectedDocCode(report.codeEtiquette);
    setUploadedFileName("");
    setIsLinkModalOpen(true);
  };

  const submitLinkReport = (e) => {
    e.preventDefault();
    if (linkMode === "file_upload" && !uploadedFileName) {
      toast.error("Veuillez sélectionner un fichier à uploader.");
      return;
    }

    setTaxationReports(prev => prev.map(rep => {
      if (rep.id === reportToLink.id) {
        return {
          ...rep,
          status: "Lié & Taxé",
          linkedDocType: linkMode,
          linkedDocName: linkMode === "document_link" ? `DOC-REF-${rep.codeEtiquette}.pdf` : uploadedFileName
        };
      }
      return rep;
    }));

    toast.success(`Le rapport pour le lot ${reportToLink.lotNumber} a été lié avec succès !`);
    setIsLinkModalOpen(false);
    setReportToLink(null);
  };

  // Auto-fill contract seller info if linked lot has society
  const handleContractLotChange = (lotNum) => {
    const matchedReport = taxationReports.find(r => r.lotNumber === lotNum);
    if (matchedReport) {
      setContractForm(prev => ({
        ...prev,
        lotNumber: lotNum,
        sellerName: matchedReport.societe,
        sacsCount: matchedReport.sacsCount,
        quantity: matchedReport.sacsCount * (prev.tareWeight === "60 kgs" ? 60 : 30)
      }));
    } else {
      setContractForm(prev => ({ ...prev, lotNumber: lotNum }));
    }
  };

  // Change weight auto calculates quantity in kg
  const handleTareWeightChange = (weight) => {
    setContractForm(prev => {
      const sacs = parseInt(prev.sacsCount) || 0;
      const factor = weight === "60 kgs" ? 60 : 30;
      return {
        ...prev,
        tareWeight: weight,
        quantity: sacs * factor
      };
    });
  };

  // 2. Submit Contract
  const submitContract = (e) => {
    e.preventDefault();
    if (!contractForm.lotNumber) {
      toast.error("Veuillez lier un numéro de lot.");
      return;
    }

    const newContract = {
      id: `CTR-2026-00${contracts.length + 2}`,
      ...contractForm,
      unitPrice: parseFloat(contractForm.unitPrice) || 0,
      quantity: parseFloat(contractForm.quantity) || 0,
      sacsCount: parseInt(contractForm.sacsCount) || 0,
      guaranteeAmount: parseFloat(contractForm.guaranteeAmount) || 0,
      lotCount: parseInt(contractForm.lotCount) || 1,
      status: "Actif",
      createdAt: new Date().toISOString().split("T")[0]
    };

    setContracts(prev => [newContract, ...prev]);
    toast.success(`Le contrat ${newContract.id} a été enregistré.`);
    setIsContractFormOpen(false);
    // Reset form
    setContractForm({
      lotNumber: "", contractType: "Vente", coffeeType: "Arabica",
      sellerName: "", sellerNif: "", sellerPhone: "",
      buyerName: "", buyerCountry: "Belgique", buyerBp: "", buyerEmail: "", buyerPhone: "",
      unitPrice: "", quantity: "", deliveryDate: "", sacsCount: "", tareWeight: "60 kgs",
      guaranteeAmount: "", guaranteeType: "Par sac", lotCount: 1
    });
  };

  // Auto-fill export info if contract selected
  const handleExportContractChange = (contractId) => {
    const matchedContract = contracts.find(c => c.id === contractId);
    if (matchedContract) {
      // Find quality from taxation report
      const matchedReport = taxationReports.find(r => r.lotNumber === matchedContract.lotNumber);
      setExportForm(prev => ({
        ...prev,
        contractId: contractId,
        oicExporter: matchedContract.sellerName,
        oicNotifyAddress: `${matchedContract.buyerName}, ${matchedContract.buyerCountry}`,
        oicDestinationCountry: matchedContract.buyerCountry
      }));
    } else {
      setExportForm(prev => ({ ...prev, contractId }));
    }
  };

  // 3. Submit Export
  const submitExport = (e) => {
    e.preventDefault();
    if (!exportForm.contractId) {
      toast.error("Veuillez sélectionner un contrat.");
      return;
    }

    const matchedContract = contracts.find(c => c.id === exportForm.contractId);
    const matchedReport = taxationReports.find(r => r.lotNumber === matchedContract?.lotNumber);

    const newExport = {
      id: `EXP-2026-00${exportsList.length + 2}`,
      contractId: exportForm.contractId,
      lotNumber: matchedContract?.lotNumber || "N/A",
      exporterName: matchedContract?.sellerName || "N/A",
      loadingDate: exportForm.loadingDate,
      transportMode: exportForm.transportMode,
      carrierName: exportForm.carrierName,
      sacsCount: matchedContract?.sacsCount || 0,
      quality: matchedReport?.qualite || matchedContract?.coffeeType || "N/A",
      modeE: exportForm.modeE,
      douaneDoc: exportForm.douaneDoc || "douane_doc.pdf",
      qualityCertDoc: exportForm.qualityCertDoc || "certificat_qualite.pdf",
      oicDocName: exportForm.oicDoc || "oic_certificat.pdf",
      oicExporter: matchedContract?.sellerName || "",
      oicNotifyAddress: exportForm.oicNotifyAddress,
      oicDestinationCountry: matchedContract?.buyerCountry || "",
      oicTranshipmentCountry: exportForm.oicTranshipmentCountry,
      swiftTransactionId: exportForm.swiftTransactionId,
      swiftDoc: exportForm.swiftDoc || "swift_doc.pdf",
      exploitationDoc: exportForm.exploitationDoc || "exploitation_doc.pdf",
      contractDoc: exportForm.contractDoc || "contract_copy.pdf",
      factureDoc: exportForm.factureDoc || "facture_invoice.pdf",
      accordVenteDoc: exportForm.accordVenteDoc || "accord_vente.pdf",
      accordVenteQty: parseFloat(exportForm.accordVenteQty) || matchedContract?.quantity || 0,
      debitNoteDoc: exportForm.debitNoteDoc || "debit_note.pdf",
      lotCount: parseInt(exportForm.lotCount) || 1,
      status: "Confirmé BESD & ODECA",
      createdAt: new Date().toISOString().split("T")[0]
    };

    setExportsList(prev => [newExport, ...prev]);
    toast.success(`La confirmation d'exportation ${newExport.id} a été soumise avec succès.`);
    setIsExportFormOpen(false);
    // Reset Form
    setExportForm({
      contractId: "", loadingDate: "", transportMode: "Camion", carrierName: "", modeE: "",
      douaneDoc: "", qualityCertDoc: "", oicDoc: "", oicNotifyAddress: "", oicTranshipmentCountry: "Tanzanie",
      swiftTransactionId: "", swiftDoc: "", exploitationDoc: "", contractDoc: "", factureDoc: "",
      accordVenteDoc: "", accordVenteQty: "", debitNoteDoc: "", lotCount: 1
    });
  };

  // Filter Functions
  const filteredTaxationReports = taxationReports.filter(rep => {
    const q = searchTaxation.toLowerCase();
    return rep.lotNumber.toLowerCase().includes(q) || rep.codeEtiquette.toLowerCase().includes(q) || rep.societe.toLowerCase().includes(q);
  });

  const filteredContractsList = contracts.filter(c => {
    const q = searchContract.toLowerCase();
    return c.id.toLowerCase().includes(q) || c.lotNumber.toLowerCase().includes(q) || c.buyerName.toLowerCase().includes(q) || c.sellerName.toLowerCase().includes(q);
  });

  const filteredExportsList = exportsList.filter(exp => {
    const q = searchExport.toLowerCase();
    return exp.id.toLowerCase().includes(q) || exp.contractId.toLowerCase().includes(q) || exp.exporterName.toLowerCase().includes(q) || exp.lotNumber.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header section with theme styles */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          🤝 Module de Commercialisation
        </h1>
        <p className="text-muted-foreground text-sm">
          Gérez la réception des rapports de taxation du laboratoire, la négociation des contrats de vente/achat et le processus réglementaire de confirmation d'exportation (BESD et ODECA).
        </p>
      </div>

      {/* Main Tabs Container */}
      <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl bg-muted p-1 rounded-xl">
          <TabsTrigger value="taxation" className="flex items-center gap-2 rounded-lg">
            <FileText className="h-4 w-4" />
            <span>Réception & Taxation</span>
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2 rounded-lg">
            <FileSignature className="h-4 w-4" />
            <span>Contrats d'Achat/Vente</span>
          </TabsTrigger>
          <TabsTrigger value="exports" className="flex items-center gap-2 rounded-lg">
            <Landmark className="h-4 w-4" />
            <span>Confirmations Export</span>
          </TabsTrigger>
        </TabsList>

        {/* ==========================================
            TAB 1: RECEPTION & TAXATION
            ========================================== */}
        <TabsContent value="taxation" className="space-y-4 mt-4">
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
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTaxationReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="flex items-center gap-1.5 py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedReport(report);
                            setIsSynthModalOpen(true);
                          }}
                          title="Fiche Synthèse"
                        >
                          <Eye className="h-4 w-4 text-primary" />
                        </Button>
                        {report.status === "En attente de liaison" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-xs flex items-center gap-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            onClick={() => handleOpenLinkModal(report)}
                          >
                            <LinkIcon className="h-3 w-3" /> Lier
                          </Button>
                        ) : (
                          <Badge variant="outline" className="bg-secondary/10 border-secondary/20 text-secondary text-[10px] py-1">
                            <Check className="h-2.5 w-2.5 mr-0.5 inline-block" /> Lié
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-bold text-foreground">{report.lotNumber}</TableCell>
                      <TableCell className="font-mono text-xs tracking-wider text-muted-foreground">{report.codeEtiquette}</TableCell>
                      <TableCell className="font-medium">{report.societe}</TableCell>
                      <TableCell>{report.qualite}</TableCell>
                      <TableCell>{report.sacsCount} sacs ({report.qteEchantillon.toFixed(1)} kg)</TableCell>
                      <TableCell className="font-bold text-amber-600 dark:text-amber-500">{report.noteCupping.toFixed(2)}/100</TableCell>
                      <TableCell>
                        {report.status === "Lié & Taxé" ? (
                          <Badge className="bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20">
                            Lié & Taxé
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1 w-max">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                            </span>
                            À lier
                          </Badge>
                        )}
                      </TableCell>
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
        </TabsContent>

        {/* ==========================================
            TAB 2: CONTRAT DE VENTE / ACHAT
            ========================================== */}
        <TabsContent value="contracts" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileSignature className="h-5 w-5 text-primary" /> Registre des Contrats Commercialisés
              </h2>
              <p className="text-muted-foreground text-xs">
                Saisissez les informations contractuelles des transactions d'achat et de vente basées sur les lots taxés.
              </p>
            </div>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 shadow-sm"
              onClick={() => setIsContractFormOpen(true)}
            >
              <Plus className="h-4 w-4" /> Nouveau Contrat
            </Button>
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
                          <div><span className="font-semibold text-muted-foreground">Vendeur:</span> {contract.sellerName}</div>
                          <div><span className="font-semibold text-muted-foreground">Acheteur:</span> {contract.buyerName} ({contract.buyerCountry})</div>
                        </TableCell>
                        <TableCell>{contract.sacsCount} sacs ({contract.quantity.toLocaleString()} kg)</TableCell>
                        <TableCell className="font-semibold">{contract.unitPrice.toFixed(2)} $/kg</TableCell>
                        <TableCell className="font-bold text-foreground">{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $</TableCell>
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
        </TabsContent>

        {/* ==========================================
            TAB 3: CONFIRMATION EXPORT (BESD & ODECA)
            ========================================== */}
        <TabsContent value="exports" className="space-y-4 mt-4">
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
              onClick={() => setIsExportFormOpen(true)}
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
                        <div><span className="font-semibold text-muted-foreground">Mode:</span> {exp.transportMode}</div>
                        <div><span className="font-semibold text-muted-foreground">Chauffeur/Soc:</span> {exp.carrierName}</div>
                        <div><span className="font-semibold text-muted-foreground">Chargement:</span> {exp.loadingDate}</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-bold">{exp.quality}</div>
                        <div className="text-muted-foreground">{exp.sacsCount} sacs</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div><span className="font-semibold text-muted-foreground">Pays:</span> {exp.oicDestinationCountry}</div>
                        {exp.oicTranshipmentCountry && (
                          <div><span className="font-semibold text-muted-foreground">Transbord:</span> {exp.oicTranshipmentCountry}</div>
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
        </TabsContent>
      </Tabs>


      {/* ==========================================
          MODAL: FICHE SYNTHÈSE DE TAXATION (PRINT READY)
          ========================================== */}
      <Dialog open={isSynthModalOpen} onOpenChange={setIsSynthModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-slate-900 border border-slate-300 dark:bg-white dark:text-slate-900 p-8 shadow-2xl">
          <DialogHeader className="border-b border-slate-200 pb-4">
            <DialogTitle className="text-xl font-extrabold tracking-tight text-slate-900 flex justify-between items-center w-full">
              <span>RAPPORT D'ANALYSE ET DE TAXATION DU CAFÉ</span>
              <Badge className="bg-primary text-white border-none font-mono">ODECA-LAB</Badge>
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Document officiel certifié par l'Office du Café (ODECA).
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="py-6 space-y-6 text-sm text-slate-800 leading-relaxed font-sans">
              {/* Header Title */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h1 className="text-2xl font-black tracking-wider uppercase text-slate-900">CERTIFICAT DE QUALITÉ ET DE TAXATION</h1>
                <p className="text-xs font-bold text-slate-500 mt-1">DATE DE RÉCEPTION : {selectedReport.dateReception}</p>
                <p className="text-xs font-bold text-emerald-700 tracking-widest font-mono mt-1">N° DE CODE ANONYME : {selectedReport.codeEtiquette}</p>
              </div>

              {/* Informative details */}
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <p><span className="font-bold text-slate-500">PROPRIÉTAIRE :</span> <span className="font-bold">{selectedReport.societe}</span></p>
                  <p><span className="font-bold text-slate-500">ORIGINE / USINE :</span> <span>{selectedReport.deparcheur}</span></p>
                  <p><span className="font-bold text-slate-500">NUMÉRO DE LOT :</span> <span className="font-bold">{selectedReport.lotNumber}</span></p>
                </div>
                <div className="space-y-1 text-right">
                  <p><span className="font-bold text-slate-500">VOLUME REPRÉSENTÉ :</span> <span>{selectedReport.sacsCount} sacs ({selectedReport.qteEchantillon.toFixed(2)} kg)</span></p>
                  <p><span className="font-bold text-slate-500">CLASSIFICATION PROPRIÉTÉ :</span> <span className="font-semibold">{selectedReport.qualite}</span></p>
                </div>
              </div>

              {/* Technical results table */}
              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 flex items-center gap-1">
                  <Scale className="h-3.5 w-3.5 text-primary" /> 1. ANALYSE PHYSIQUE ET MÉCANIQUE (GRANULOMÉTRIE)
                </h3>
                <div className="grid grid-cols-6 gap-2 text-center text-xs">
                  <div className="border border-slate-200 p-2 rounded bg-slate-50"><span className="block font-bold text-slate-500">7.1 mm</span><span className="font-bold">{selectedReport.granulometrie?.sieve_7_1.toFixed(1)}%</span></div>
                  <div className="border border-slate-200 p-2 rounded bg-slate-50"><span className="block font-bold text-slate-500">6.3 mm</span><span className="font-bold">{selectedReport.granulometrie?.sieve_6_3.toFixed(1)}%</span></div>
                  <div className="border border-slate-200 p-2 rounded bg-slate-50"><span className="block font-bold text-slate-500">5.5 mm</span><span className="font-bold">{selectedReport.granulometrie?.sieve_5_5.toFixed(1)}%</span></div>
                  <div className="border border-slate-200 p-2 rounded bg-slate-50"><span className="block font-bold text-slate-500">4.0 mm</span><span className="font-bold">{selectedReport.granulometrie?.sieve_4_0.toFixed(1)}%</span></div>
                  <div className="border border-slate-200 p-2 rounded bg-slate-50"><span className="block font-bold text-slate-500">3.0 mm</span><span className="font-bold">{selectedReport.granulometrie?.sieve_3_0.toFixed(1)}%</span></div>
                  <div className="border border-slate-200 p-2 rounded bg-slate-50"><span className="block font-bold text-slate-500">Fond</span><span className="font-bold">{selectedReport.granulometrie?.fond.toFixed(1)}%</span></div>
                </div>
              </div>

              {/* Defects table */}
              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-primary" /> 2. TRIAGE MANUEL & DÉFAUTS
                </h3>
                <table className="w-full text-xs text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-2 border-r border-slate-200">Type de Défauts</th>
                      <th className="p-2 text-right">Pourcentage Retenu (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-medium">Vrais défauts</td>
                      <td className="p-2 text-right font-semibold">{selectedReport.triage?.vraisDefauts.toFixed(2)}%</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-medium">Défectueux</td>
                      <td className="p-2 text-right font-semibold">{selectedReport.triage?.defectueux.toFixed(2)}%</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-medium">Brisure</td>
                      <td className="p-2 text-right font-semibold">{selectedReport.triage?.brisure.toFixed(2)}%</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-medium">N et Rat (Noirs & Ratatinés)</td>
                      <td className="p-2 text-right font-semibold">{selectedReport.triage?.nEtRat.toFixed(2)}%</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-medium">Corps étrangers</td>
                      <td className="p-2 text-right font-semibold">{selectedReport.triage?.corpsEtrangers.toFixed(2)}%</td>
                    </tr>
                    <tr className="bg-slate-50/50 font-bold">
                      <td className="p-2 border-r border-slate-200 text-slate-700 uppercase">Taux total de défauts physiques</td>
                      <td className="p-2 text-right text-red-600 font-extrabold text-sm">{selectedReport.triage?.totalDefectPct.toFixed(2)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cupping section */}
              <div className="space-y-4 pt-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-amber-500" /> 3. APPRÉCIATION SENSORIELLE & CUPPING
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-3 gap-4">
                  <div className="text-center border-r border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Note de tasse</span>
                    <span className="text-2xl font-black text-amber-700">{selectedReport.degustation?.moyenne.toFixed(2)} / 100</span>
                  </div>
                  <div className="text-center border-r border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Appréciation</span>
                    <span className="text-lg font-black text-emerald-700">{selectedReport.degustation?.qualite}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Dégustateurs</span>
                    <span className="text-base font-bold text-slate-700">{selectedReport.degustation?.nbDegustateurs} experts</span>
                  </div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Profil Aromatique en Tasse</span>
                  <p className="text-xs italic text-slate-600 leading-relaxed mt-1 font-medium">
                    "{selectedReport.degustation?.observation}"
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-slate-200 pt-4 flex justify-between items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center gap-1 bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200"
            >
              <Printer className="h-4 w-4" /> Imprimer le Certificat
            </Button>
            <Button
              type="button"
              className="bg-primary text-white hover:bg-primary/90"
              onClick={() => setIsSynthModalOpen(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* ==========================================
          MODAL: LIER LE RAPPORT DE TAXATION
          ========================================== */}
      <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <LinkIcon className="h-5 w-5 text-primary" /> Lier le Rapport de Taxation
            </DialogTitle>
            <DialogDescription>
              Connectez ce rapport du laboratoire avec les documents de commercialisation.
            </DialogDescription>
          </DialogHeader>

          {reportToLink && (
            <form onSubmit={submitLinkReport} className="space-y-4 pt-4">
              <div className="bg-muted p-3 rounded-lg text-xs space-y-1.5 border border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Numéro de Lot:</span>
                  <span className="font-bold text-foreground">{reportToLink.lotNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Société:</span>
                  <span className="font-semibold text-foreground">{reportToLink.societe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Qualité d'Origine:</span>
                  <span className="font-semibold text-foreground">{reportToLink.qualite}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Source du document de liaison</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="linkMode"
                      value="document_link"
                      checked={linkMode === "document_link"}
                      onChange={() => setLinkMode("document_link")}
                      className="accent-primary"
                    />
                    Lier le code laboratoire existant
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="linkMode"
                      value="file_upload"
                      checked={linkMode === "file_upload"}
                      onChange={() => setLinkMode("file_upload")}
                      className="accent-primary"
                    />
                    Uploader un document externe
                  </label>
                </div>
              </div>

              {linkMode === "document_link" ? (
                <div className="space-y-1.5">
                  <Label htmlFor="docCode" className="text-xs text-muted-foreground">Document Laboratoire</Label>
                  <select
                    id="docCode"
                    value={selectedDocCode}
                    onChange={(e) => setSelectedDocCode(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  >
                    <option value={reportToLink.codeEtiquette}>
                      {reportToLink.codeEtiquette} ({reportToLink.qualite} - Note: {reportToLink.noteCupping}/100)
                    </option>
                  </select>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <Label className="text-xs text-muted-foreground">Upload de Fichier</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors relative">
                    <input
                      type="file"
                      onChange={(e) => setUploadedFileName(e.target.files[0]?.name || "")}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <UploadCloud className="h-8 w-8 text-primary mx-auto mb-2" />
                    <span className="text-xs font-semibold text-foreground block">
                      {uploadedFileName || "Cliquez ou glissez le document PDF de taxation"}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">Format PDF (Max. 5 Mo)</span>
                  </div>
                </div>
              )}

              <DialogFooter className="pt-4 border-t border-border gap-2">
                <Button variant="outline" type="button" onClick={() => setIsLinkModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Enregistrer & Valider
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>


      {/* ==========================================
          MODAL: CRÉATION DE CONTRAT D'ACHAT/VENTE
          ========================================== */}
      <Dialog open={isContractFormOpen} onOpenChange={setIsContractFormOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <FileSignature className="h-5 w-5 text-primary" /> Nouveau Contrat Commercial
            </DialogTitle>
            <DialogDescription>
              Veuillez saisir les coordonnées des parties et les détails de la vente basés sur le lot de café taxé.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitContract} className="space-y-6 pt-4">
            {/* 1. INFORMATIONS GÉNÉRALES */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b border-border pb-1">1. Informations Générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="lotSelect">No. du Lot *</Label>
                  <select
                    id="lotSelect"
                    value={contractForm.lotNumber}
                    onChange={(e) => handleContractLotChange(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none"
                    required
                  >
                    <option value="">-- Sélectionner Lot --</option>
                    {taxationReports.filter(r => r.status === "Lié & Taxé").map(r => (
                      <option key={r.id} value={r.lotNumber}>
                        {r.lotNumber} ({r.societe} - {r.qualite})
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-muted-foreground">Seuls les lots liés et taxés sont affichés.</span>
                </div>

                <div className="space-y-1.5">
                  <Label>Type de contrat *</Label>
                  <div className="flex gap-4 h-9 items-center">
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="contractType"
                        value="Vente"
                        checked={contractForm.contractType === "Vente"}
                        onChange={(e) => setContractForm(prev => ({ ...prev, contractType: e.target.value }))}
                        className="accent-primary"
                      />
                      Vente
                    </label>
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="contractType"
                        value="Achat"
                        checked={contractForm.contractType === "Achat"}
                        onChange={(e) => setContractForm(prev => ({ ...prev, contractType: e.target.value }))}
                        className="accent-primary"
                      />
                      Achat
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Type de café *</Label>
                  <div className="flex gap-4 h-9 items-center">
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="coffeeType"
                        value="Arabica"
                        checked={contractForm.coffeeType === "Arabica"}
                        onChange={(e) => setContractForm(prev => ({ ...prev, coffeeType: e.target.value }))}
                        className="accent-primary"
                      />
                      Arabica
                    </label>
                    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="coffeeType"
                        value="Robusta"
                        checked={contractForm.coffeeType === "Robusta"}
                        onChange={(e) => setContractForm(prev => ({ ...prev, coffeeType: e.target.value }))}
                        className="accent-primary"
                      />
                      Robusta
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ADRESSE DU VENDEUR */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b border-border pb-1">2. Adresse du Vendeur (Exportateur)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sellerName">Nom de la société *</Label>
                  <Input
                    id="sellerName"
                    placeholder="Nom de la société"
                    value={contractForm.sellerName}
                    onChange={(e) => setContractForm(prev => ({ ...prev, sellerName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sellerNif">NIF de la société *</Label>
                  <Input
                    id="sellerNif"
                    placeholder="Ex: 400012345-0"
                    value={contractForm.sellerNif}
                    onChange={(e) => setContractForm(prev => ({ ...prev, sellerNif: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sellerPhone">Téléphone vendeur *</Label>
                  <Input
                    id="sellerPhone"
                    type="tel"
                    placeholder="Téléphone"
                    value={contractForm.sellerPhone}
                    onChange={(e) => setContractForm(prev => ({ ...prev, sellerPhone: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 3. ADRESSE DE L'ACHETEUR */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b border-border pb-1">3. Adresse de l'Acheteur (Client)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="buyerName">Nom et Prénom / Société de l'acheteur *</Label>
                  <Input
                    id="buyerName"
                    placeholder="Ex: Starbucks Corp"
                    value={contractForm.buyerName}
                    onChange={(e) => setContractForm(prev => ({ ...prev, buyerName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="buyerCountry">Pays de destination *</Label>
                  <select
                    id="buyerCountry"
                    value={contractForm.buyerCountry}
                    onChange={(e) => setContractForm(prev => ({ ...prev, buyerCountry: e.target.value }))}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none"
                    required
                  >
                    {countryList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="buyerBp">Boîte Postale</Label>
                  <Input
                    id="buyerBp"
                    placeholder="BP / Code Postal"
                    value={contractForm.buyerBp}
                    onChange={(e) => setContractForm(prev => ({ ...prev, buyerBp: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="buyerEmail">Email de contact *</Label>
                  <Input
                    id="buyerEmail"
                    type="email"
                    placeholder="client@coffee.com"
                    value={contractForm.buyerEmail}
                    onChange={(e) => setContractForm(prev => ({ ...prev, buyerEmail: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="buyerPhone">Téléphone acheteur *</Label>
                  <Input
                    id="buyerPhone"
                    type="tel"
                    placeholder="Numéro de tel"
                    value={contractForm.buyerPhone}
                    onChange={(e) => setContractForm(prev => ({ ...prev, buyerPhone: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 4. DÉTAILS DE LA TRANSACTION */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b border-border pb-1">4. Détails de la Transaction</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="unitPrice">Prix unitaire ($ / kg) *</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 4.85"
                    value={contractForm.unitPrice}
                    onChange={(e) => setContractForm(prev => ({ ...prev, unitPrice: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sacsCount">Nombre de sacs *</Label>
                  <Input
                    id="sacsCount"
                    type="number"
                    placeholder="Ex: 85"
                    value={contractForm.sacsCount}
                    onChange={(e) => {
                      const sacs = parseInt(e.target.value) || 0;
                      const factor = contractForm.tareWeight === "60 kgs" ? 60 : 30;
                      setContractForm(prev => ({ ...prev, sacsCount: e.target.value, quantity: sacs * factor }));
                    }}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tareWeight">Poids tare / sac *</Label>
                  <select
                    id="tareWeight"
                    value={contractForm.tareWeight}
                    onChange={(e) => handleTareWeightChange(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    required
                  >
                    <option value="60 kgs">60 kgs</option>
                    <option value="30 kgs">30 kgs</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="quantity">Quantité totale (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Calculée"
                    value={contractForm.quantity}
                    onChange={(e) => setContractForm(prev => ({ ...prev, quantity: e.target.value }))}
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="deliveryDate">Date de livraison *</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={contractForm.deliveryDate}
                    onChange={(e) => setContractForm(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="guaranteeAmount">Montant garantie ($) *</Label>
                  <Input
                    id="guaranteeAmount"
                    type="number"
                    step="0.01"
                    placeholder="Garantie"
                    value={contractForm.guaranteeAmount}
                    onChange={(e) => setContractForm(prev => ({ ...prev, guaranteeAmount: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="guaranteeType">Type de garantie *</Label>
                  <select
                    id="guaranteeType"
                    value={contractForm.guaranteeType}
                    onChange={(e) => setContractForm(prev => ({ ...prev, guaranteeType: e.target.value }))}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    required
                  >
                    <option value="Par sac">Par sac</option>
                    <option value="Par lot">Par lot</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lotCount">Nombre de lot *</Label>
                  <Input
                    id="lotCount"
                    type="number"
                    value={contractForm.lotCount}
                    onChange={(e) => setContractForm(prev => ({ ...prev, lotCount: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border gap-2">
              <Button variant="outline" type="button" onClick={() => setIsContractFormOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Enregistrer le Contrat
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


      {/* ==========================================
          MODAL: SOUMISSION DE MISE À L'EXPLOITATION (EXPORT)
          ========================================== */}
      <Dialog open={isExportFormOpen} onOpenChange={setIsExportFormOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Landmark className="h-5 w-5 text-primary" /> Dossier de Confirmation d'Exportation
            </DialogTitle>
            <DialogDescription>
              Renseignez les pièces administratives de l'exportateur, les documents douaniers et les justificatifs financiers Swift.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitExport} className="space-y-6 pt-4">
            {/* 1. FORMULAIRE DE MISE A L'EXPLOITATION */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b border-border pb-1">1. Mise à l'Exploitation (Logistique)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contractSelect">Sélectionner Contrat *</Label>
                  <select
                    id="contractSelect"
                    value={exportForm.contractId}
                    onChange={(e) => handleExportContractChange(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none"
                    required
                  >
                    <option value="">-- Sélectionner Contrat --</option>
                    {contracts.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.id} (Lot {c.lotNumber} - {c.sellerName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="loadingDate">Date de chargement *</Label>
                  <Input
                    id="loadingDate"
                    type="date"
                    value={exportForm.loadingDate}
                    onChange={(e) => setExportForm(prev => ({ ...prev, loadingDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="transportMode">Mode de transport *</Label>
                  <select
                    id="transportMode"
                    value={exportForm.transportMode}
                    onChange={(e) => setExportForm(prev => ({ ...prev, transportMode: e.target.value }))}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    required
                  >
                    <option value="Camion">Camion</option>
                    <option value="Barge">Barge</option>
                    <option value="Train">Train</option>
                    <option value="Avion">Avion</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="carrierName">Nom du transporteur *</Label>
                  <Input
                    id="carrierName"
                    placeholder="Nom du transporteur"
                    value={exportForm.carrierName}
                    onChange={(e) => setExportForm(prev => ({ ...prev, carrierName: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="modeE">Mode E (Réf. Exploitation) *</Label>
                  <Input
                    id="modeE"
                    placeholder="Ex: EXP-MODE-E-99"
                    value={exportForm.modeE}
                    onChange={(e) => setExportForm(prev => ({ ...prev, modeE: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lotCountExport">Nombre de lots (Suivi) *</Label>
                  <Input
                    id="lotCountExport"
                    type="number"
                    value={exportForm.lotCount}
                    onChange={(e) => setExportForm(prev => ({ ...prev, lotCount: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="douaneDoc">Déclaration Douane *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="douaneDoc"
                      placeholder="Attacher Déclaration Douane"
                      value={exportForm.douaneDoc}
                      onChange={(e) => setExportForm(prev => ({ ...prev, douaneDoc: e.target.value }))}
                      className="text-xs"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                      onClick={() => setExportForm(prev => ({ ...prev, douaneDoc: "douane_upload_cert.pdf" }))}
                    >
                      <UploadCloud className="h-3.5 w-3.5" /> Uploader
                    </Button>
                  </div>
                  {exportForm.douaneDoc && <span className="text-[10px] text-green-600">✓ Fichier douane prêt</span>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="qualityCertDoc">Certificat de Qualité Labo *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="qualityCertDoc"
                      placeholder="Attacher Certificat Qualité"
                      value={exportForm.qualityCertDoc}
                      onChange={(e) => setExportForm(prev => ({ ...prev, qualityCertDoc: e.target.value }))}
                      className="text-xs"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                      onClick={() => setExportForm(prev => ({ ...prev, qualityCertDoc: "cert_qualite_linked.pdf" }))}
                    >
                      <UploadCloud className="h-3.5 w-3.5" /> Lier
                    </Button>
                  </div>
                  {exportForm.qualityCertDoc && <span className="text-[10px] text-green-600">✓ Certificat qualité lié</span>}
                </div>
              </div>
            </div>

            {/* 2. CERTIFICAT OIC / ICO */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b border-border pb-1">2. Certificat OIC / ICO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="oicDoc">Fichier du Certificat OIC/ICO *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="oicDoc"
                      placeholder="Uploader Certificat OIC"
                      value={exportForm.oicDoc}
                      onChange={(e) => setExportForm(prev => ({ ...prev, oicDoc: e.target.value }))}
                      className="text-xs"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                      onClick={() => setExportForm(prev => ({ ...prev, oicDoc: "oic_ico_certificat_physique.pdf" }))}
                    >
                      <UploadCloud className="h-3.5 w-3.5" /> Uploader
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="oicNotifyAddress">Adresse de notification (Client) *</Label>
                  <textarea
                    id="oicNotifyAddress"
                    rows={1}
                    placeholder="Nom, Adresse complète de l'acheteur"
                    value={exportForm.oicNotifyAddress}
                    onChange={(e) => setExportForm(prev => ({ ...prev, oicNotifyAddress: e.target.value }))}
                    className="flex min-h-[36px] w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-sm focus-visible:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="oicTranshipment">Pays de transbordement (Transit)</Label>
                  <select
                    id="oicTranshipment"
                    value={exportForm.oicTranshipmentCountry}
                    onChange={(e) => setExportForm(prev => ({ ...prev, oicTranshipmentCountry: e.target.value }))}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Aucun">Aucun (Direct)</option>
                    <option value="Tanzanie">Tanzanie (Dar es Salaam)</option>
                    <option value="Kenya">Kenya (Mombasa)</option>
                    <option value="Ouganda">Ouganda</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground block font-medium">Exportateur Notifié</span>
                  <div className="bg-muted p-2 rounded text-xs font-bold text-foreground border border-border h-9 flex items-center">
                    {exportForm.oicExporter || "Sélectionnez un contrat..."}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. DOCUMENTS FINANCIERS & JUSTIFICATIFS */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b border-border pb-1">3. Justificatifs Financiers & Originaux</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="swiftTxId">Transaction ID Swift (Encaissement) *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="swiftTxId"
                      placeholder="Ex: Swift Reference ID"
                      value={exportForm.swiftTransactionId}
                      onChange={(e) => setExportForm(prev => ({ ...prev, swiftTransactionId: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                      onClick={() => setExportForm(prev => ({ ...prev, swiftDoc: "swift_payment_receipt.pdf" }))}
                    >
                      <UploadCloud className="h-3.5 w-3.5" /> SWIFT
                    </Button>
                  </div>
                  {exportForm.swiftDoc && <span className="text-[10px] text-green-600 block">✓ Fichier Swift lié</span>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="exploitationDoc">Déclaration de l'exploitation *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="exploitationDoc"
                      placeholder="Uploader Déclaration"
                      value={exportForm.exploitationDoc}
                      className="text-xs"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                      onClick={() => setExportForm(prev => ({ ...prev, exploitationDoc: "dec_exploitation_2026.pdf" }))}
                    >
                      <UploadCloud className="h-3.5 w-3.5" /> Uploader
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contractDoc">Contrat de vente/achat original *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="contractDoc"
                      placeholder="Lier Contrat Vente"
                      value={exportForm.contractDoc}
                      className="text-xs"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                      onClick={() => setExportForm(prev => ({ ...prev, contractDoc: "contrat_vente_valide.pdf" }))}
                    >
                      <LinkIcon className="h-3.5 w-3.5" /> Lier
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="factureDoc">Facture Commerciale *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="factureDoc"
                      placeholder="Uploader Facture"
                      value={exportForm.factureDoc}
                      className="text-xs"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                      onClick={() => setExportForm(prev => ({ ...prev, factureDoc: "facture_commerciale.pdf" }))}
                    >
                      <UploadCloud className="h-3.5 w-3.5" /> Facture
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="accordVenteQty">Accord de Vente (Privé) & Quantité *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accordVenteQty"
                      type="number"
                      placeholder="Quantité (kg)"
                      value={exportForm.accordVenteQty}
                      onChange={(e) => setExportForm(prev => ({ ...prev, accordVenteQty: e.target.value }))}
                      className="w-1/2"
                      required
                    />
                    <Input
                      placeholder="Fichier Accord"
                      value={exportForm.accordVenteDoc}
                      className="text-xs w-1/2"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                      onClick={() => setExportForm(prev => ({ ...prev, accordVenteDoc: "accord_vente_prive.pdf" }))}
                    >
                      <UploadCloud className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="debitNoteDoc">Note de Débit *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="debitNoteDoc"
                      placeholder="Uploader Note de débit"
                      value={exportForm.debitNoteDoc}
                      className="text-xs"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                      onClick={() => setExportForm(prev => ({ ...prev, debitNoteDoc: "note_debit_frais.pdf" }))}
                    >
                      <UploadCloud className="h-3.5 w-3.5" /> Uploader
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border gap-2">
              <Button variant="outline" type="button" onClick={() => setIsExportFormOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Soumettre au BESD & ODECA
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
