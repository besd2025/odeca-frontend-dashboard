import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Landmark, UploadCloud, Link as LinkIcon } from "lucide-react";

export default function ExportFormDialog({
  isOpen,
  onOpenChange,
  contracts,
  taxationReports,
  onSubmit,
}) {
  const [form, setForm] = useState({
    contractId: "",
    loadingDate: "",
    transportMode: "Camion",
    carrierName: "",
    modeE: "",
    douaneDoc: "",
    qualityCertDoc: "",
    oicDoc: "",
    oicExporter: "",
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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({
        contractId: "",
        loadingDate: "",
        transportMode: "Camion",
        carrierName: "",
        modeE: "",
        douaneDoc: "",
        qualityCertDoc: "",
        oicDoc: "",
        oicExporter: "",
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
    }
  }, [isOpen]);

  const handleContractChange = (contractId) => {
    const matchedContract = contracts.find(c => c.id === contractId);
    if (matchedContract) {
      setForm(prev => ({
        ...prev,
        contractId: contractId,
        oicExporter: matchedContract.sellerName,
        oicNotifyAddress: `${matchedContract.buyerName}, ${matchedContract.buyerCountry}`,
        oicDestinationCountry: matchedContract.buyerCountry,
        accordVenteQty: matchedContract.quantity
      }));
    } else {
      setForm(prev => ({ ...prev, contractId }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Landmark className="h-5 w-5 text-primary" /> Dossier de Confirmation d'Exportation
          </DialogTitle>
          <DialogDescription>
            Renseignez les pièces administratives de l'exportateur, les documents douaniers et les justificatifs financiers Swift.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* 1. MISE A L'EXPLOITATION */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary border-b border-border pb-1">1. Mise à l'Exploitation (Logistique)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="contractSelect">Sélectionner Contrat *</Label>
                <select
                  id="contractSelect"
                  value={form.contractId}
                  onChange={(e) => handleContractChange(e.target.value)}
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
                  value={form.loadingDate}
                  onChange={(e) => setForm(prev => ({ ...prev, loadingDate: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="transportMode">Mode de transport *</Label>
                <select
                  id="transportMode"
                  value={form.transportMode}
                  onChange={(e) => setForm(prev => ({ ...prev, transportMode: e.target.value }))}
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
                  value={form.carrierName}
                  onChange={(e) => setForm(prev => ({ ...prev, carrierName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="modeE">Mode E (Réf. Exploitation) *</Label>
                <Input
                  id="modeE"
                  placeholder="Ex: EXP-MODE-E-99"
                  value={form.modeE}
                  onChange={(e) => setForm(prev => ({ ...prev, modeE: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lotCountExport">Nombre de lots (Suivi) *</Label>
                <Input
                  id="lotCountExport"
                  type="number"
                  value={form.lotCount}
                  onChange={(e) => setForm(prev => ({ ...prev, lotCount: parseInt(e.target.value) || 1 }))}
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
                    value={form.douaneDoc}
                    className="text-xs"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                    onClick={() => setForm(prev => ({ ...prev, douaneDoc: "douane_upload_cert.pdf" }))}
                  >
                    <UploadCloud className="h-3.5 w-3.5" /> Uploader
                  </Button>
                </div>
                {form.douaneDoc && <span className="text-[10px] text-green-600">✓ Fichier douane prêt</span>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qualityCertDoc">Certificat de Qualité Labo *</Label>
                <div className="flex gap-2">
                  <Input
                    id="qualityCertDoc"
                    placeholder="Attacher Certificat Qualité"
                    value={form.qualityCertDoc}
                    className="text-xs"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                    onClick={() => setForm(prev => ({ ...prev, qualityCertDoc: "cert_qualite_linked.pdf" }))}
                  >
                    <UploadCloud className="h-3.5 w-3.5" /> Lier
                  </Button>
                </div>
                {form.qualityCertDoc && <span className="text-[10px] text-green-600">✓ Certificat qualité lié</span>}
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
                    value={form.oicDoc}
                    className="text-xs"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                    onClick={() => setForm(prev => ({ ...prev, oicDoc: "oic_ico_certificat_physique.pdf" }))}
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
                  value={form.oicNotifyAddress}
                  onChange={(e) => setForm(prev => ({ ...prev, oicNotifyAddress: e.target.value }))}
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
                  value={form.oicTranshipmentCountry}
                  onChange={(e) => setForm(prev => ({ ...prev, oicTranshipmentCountry: e.target.value }))}
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
                  {form.oicExporter || "Sélectionnez un contrat..."}
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
                    value={form.swiftTransactionId}
                    onChange={(e) => setForm(prev => ({ ...prev, swiftTransactionId: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                    onClick={() => setForm(prev => ({ ...prev, swiftDoc: "swift_payment_receipt.pdf" }))}
                  >
                    <UploadCloud className="h-3.5 w-3.5" /> SWIFT
                  </Button>
                </div>
                {form.swiftDoc && <span className="text-[10px] text-green-600 block">✓ Fichier Swift lié</span>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="exploitationDoc">Déclaration de l'exploitation *</Label>
                <div className="flex gap-2">
                  <Input
                    id="exploitationDoc"
                    placeholder="Uploader Déclaration"
                    value={form.exploitationDoc}
                    className="text-xs"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                    onClick={() => setForm(prev => ({ ...prev, exploitationDoc: "dec_exploitation_2026.pdf" }))}
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
                    value={form.contractDoc}
                    className="text-xs"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                    onClick={() => setForm(prev => ({ ...prev, contractDoc: "contrat_vente_valide.pdf" }))}
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
                    value={form.factureDoc}
                    className="text-xs"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                    onClick={() => setForm(prev => ({ ...prev, factureDoc: "facture_commerciale.pdf" }))}
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
                    value={form.accordVenteQty}
                    onChange={(e) => setForm(prev => ({ ...prev, accordVenteQty: parseFloat(e.target.value) || "" }))}
                    className="w-1/2"
                    required
                  />
                  <Input
                    placeholder="Fichier Accord"
                    value={form.accordVenteDoc}
                    className="text-xs w-1/2"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                    onClick={() => setForm(prev => ({ ...prev, accordVenteDoc: "accord_vente_prive.pdf" }))}
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
                    value={form.debitNoteDoc}
                    className="text-xs"
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 text-xs flex items-center gap-1 border-primary text-primary"
                    onClick={() => setForm(prev => ({ ...prev, debitNoteDoc: "note_debit_frais.pdf" }))}
                  >
                    <UploadCloud className="h-3.5 w-3.5" /> Uploader
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Soumettre au BESD & ODECA
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
