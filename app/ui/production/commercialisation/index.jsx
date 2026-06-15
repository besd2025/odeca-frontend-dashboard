"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileSignature, Landmark } from "lucide-react";
import { toast } from "sonner";

// Import Refactored Components
import TaxationTab from "./components/TaxationTab";
import ContractsTab from "./components/ContractsTab";
import ExportsTab from "./components/ExportsTab";
import TaxationReportDialog from "./components/TaxationReportDialog";
import ContractFormDialog from "./components/ContractFormDialog";
import ExportFormDialog from "./components/ExportFormDialog";

// ==========================================
// MOCKED DATA (INITIAL STATES)
// TO BE REPLACED BY API CALLS LATER (e.g., fetch, axios, or react-query)
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
    status: "En attente de liaison",
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
    linkedDocType: "link",
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
    accordVenteDoc: "facture_commerciale_5521.pdf",
    accordVenteQty: 5100,
    debitNoteDoc: "note_debit_0045.pdf",
    lotCount: 1,
    status: "Confirmé BESD & ODECA",
    createdAt: "2026-06-05"
  }
];

export default function CommercialisationComponent() {
  // states (will be populated/synchronized with API later)
  const [taxationReports, setTaxationReports] = useState(initialTaxationReports);
  const [contracts, setContracts] = useState(initialContracts);
  const [exportsList, setExportsList] = useState(initialExports);

  const [activeMainTab, setActiveMainTab] = useState("taxation");

  // Search filter states
  const [searchTaxation, setSearchTaxation] = useState("");
  const [searchContract, setSearchContract] = useState("");
  const [searchExport, setSearchExport] = useState("");

  // Modals & Dialogue triggers
  const [selectedReport, setSelectedReport] = useState(null);
  const [isSynthModalOpen, setIsSynthModalOpen] = useState(false);
  const [isContractFormOpen, setIsContractFormOpen] = useState(false);
  const [isExportFormOpen, setIsExportFormOpen] = useState(false);

  // Handlers for child components
  const handleViewReportDetails = (report) => {
    setSelectedReport(report);
    setIsSynthModalOpen(true);
  };

  const handleOpenContractForm = (report) => {
    setSelectedReport(report);
    setIsContractFormOpen(true);
  };

  const handleRegisterContract = (contractData) => {
    // Generates a mock ID (to be replaced by DB auto-increment or backend response)
    const newContract = {
      id: `CTR-2026-00${contracts.length + 2}`,
      ...contractData,
      unitPrice: parseFloat(contractData.unitPrice) || 0,
      quantity: parseFloat(contractData.quantity) || 0,
      sacsCount: parseInt(contractData.sacsCount) || 0,
      guaranteeAmount: parseFloat(contractData.guaranteeAmount) || 0,
      lotCount: parseInt(contractData.lotCount) || 1,
      status: "Actif",
      createdAt: new Date().toISOString().split("T")[0]
    };

    // Replace with: API post call
    setContracts(prev => [newContract, ...prev]);
    toast.success(`Le contrat ${newContract.id} a été enregistré.`);
    setIsContractFormOpen(false);
  };

  const handleRegisterExport = (exportData) => {
    const matchedContract = contracts.find(c => c.id === exportData.contractId);
    const matchedReport = taxationReports.find(r => r.lotNumber === matchedContract?.lotNumber);

    // Generates a mock ID (to be replaced by DB auto-increment or backend response)
    const newExport = {
      id: `EXP-2026-00${exportsList.length + 2}`,
      contractId: exportData.contractId,
      lotNumber: matchedContract?.lotNumber || "N/A",
      exporterName: matchedContract?.sellerName || "N/A",
      loadingDate: exportData.loadingDate,
      transportMode: exportData.transportMode,
      carrierName: exportData.carrierName,
      sacsCount: matchedContract?.sacsCount || 0,
      quality: matchedReport?.qualite || matchedContract?.coffeeType || "N/A",
      modeE: exportData.modeE,
      douaneDoc: exportData.douaneDoc || "douane_doc.pdf",
      qualityCertDoc: exportData.qualityCertDoc || "certificat_qualite.pdf",
      oicDocName: exportData.oicDoc || "oic_certificat.pdf",
      oicExporter: matchedContract?.sellerName || "",
      oicNotifyAddress: exportData.oicNotifyAddress,
      oicDestinationCountry: matchedContract?.buyerCountry || "",
      oicTranshipmentCountry: exportData.oicTranshipmentCountry,
      swiftTransactionId: exportData.swiftTransactionId,
      swiftDoc: exportData.swiftDoc || "swift_doc.pdf",
      exploitationDoc: exportData.exploitationDoc || "exploitation_doc.pdf",
      contractDoc: exportData.contractDoc || "contract_copy.pdf",
      factureDoc: exportData.factureDoc || "facture_invoice.pdf",
      accordVenteDoc: exportData.accordVenteDoc || "accord_vente.pdf",
      accordVenteQty: parseFloat(exportData.accordVenteQty) || matchedContract?.quantity || 0,
      debitNoteDoc: exportData.debitNoteDoc || "debit_note.pdf",
      lotCount: parseInt(exportData.lotCount) || 1,
      status: "Confirmé BESD & ODECA",
      createdAt: new Date().toISOString().split("T")[0]
    };

    // Replace with: API post call
    setExportsList(prev => [newExport, ...prev]);
    toast.success(`La confirmation d'exportation ${newExport.id} a été soumise avec succès.`);
    setIsExportFormOpen(false);
  };

  return (
    <div className="space-y-6 mx-4">
      {/* Header section with theme styles */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Commercialisation
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

        {/* TAB 1: RECEPTION & TAXATION */}
        <TabsContent value="taxation" className="space-y-4 mt-4">
          <TaxationTab
            taxationReports={taxationReports}
            searchTaxation={searchTaxation}
            setSearchTaxation={setSearchTaxation}
            onViewDetails={handleViewReportDetails}
            onCreateContract={handleOpenContractForm}
          />
        </TabsContent>

        {/* TAB 2: CONTRAT DE VENTE / ACHAT */}
        <TabsContent value="contracts" className="space-y-4 mt-4">
          <ContractsTab
            contracts={contracts}
            searchContract={searchContract}
            setSearchContract={setSearchContract}
          />
        </TabsContent>

        {/* TAB 3: CONFIRMATION EXPORT */}
        <TabsContent value="exports" className="space-y-4 mt-4">
          <ExportsTab
            exportsList={exportsList}
            searchExport={searchExport}
            setSearchExport={setSearchExport}
            onRequestExport={() => setIsExportFormOpen(true)}
          />
        </TabsContent>
      </Tabs>

      {/* MODAL 1: FICHE SYNTHÈSE DE TAXATION */}
      <TaxationReportDialog
        isOpen={isSynthModalOpen}
        onOpenChange={setIsSynthModalOpen}
        selectedReport={selectedReport}
      />

      {/* MODAL 2: CRÉATION DE CONTRAT */}
      <ContractFormDialog
        isOpen={isContractFormOpen}
        onOpenChange={setIsContractFormOpen}
        taxationReports={taxationReports}
        onSubmit={handleRegisterContract}
        prefilledReport={selectedReport}
      />

      {/* MODAL 3: SOUMISSION DE MISE À L'EXPLOITATION */}
      <ExportFormDialog
        isOpen={isExportFormOpen}
        onOpenChange={setIsExportFormOpen}
        contracts={contracts}
        taxationReports={taxationReports}
        onSubmit={handleRegisterExport}
      />
    </div>
  );
}
