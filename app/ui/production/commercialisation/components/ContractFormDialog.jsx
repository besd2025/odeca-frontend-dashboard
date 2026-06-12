import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileSignature } from "lucide-react";

const countryList = [
  "Belgique", "Allemagne", "États-Unis", "Japon", "Suisse", "France",
  "Italie", "Royaume-Uni", "Canada", "Burundi", "Rwanda", "Kenya", "Tanzanie"
];

export default function ContractFormDialog({
  isOpen,
  onOpenChange,
  taxationReports,
  onSubmit,
  prefilledReport,
}) {
  const [form, setForm] = useState({
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

  // Prefill form when modal opens with a prefilled report
  useEffect(() => {
    if (isOpen) {
      if (prefilledReport) {
        setForm({
          lotNumber: prefilledReport.lotNumber,
          contractType: "Vente",
          coffeeType: "Arabica",
          sellerName: prefilledReport.societe || "",
          sellerNif: "",
          sellerPhone: "",
          buyerName: "",
          buyerCountry: "Belgique",
          buyerBp: "",
          buyerEmail: "",
          buyerPhone: "",
          unitPrice: "",
          sacsCount: prefilledReport.sacsCount || "",
          tareWeight: "60 kgs",
          quantity: (prefilledReport.sacsCount || 0) * 60,
          deliveryDate: "",
          guaranteeAmount: "",
          guaranteeType: "Par sac",
          lotCount: 1
        });
      } else {
        // Reset form
        setForm({
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
      }
    }
  }, [isOpen, prefilledReport]);

  const handleLotChange = (lotNum) => {
    const matchedReport = taxationReports.find(r => r.lotNumber === lotNum);
    if (matchedReport) {
      setForm(prev => ({
        ...prev,
        lotNumber: lotNum,
        sellerName: matchedReport.societe,
        sacsCount: matchedReport.sacsCount,
        quantity: matchedReport.sacsCount * (prev.tareWeight === "60 kgs" ? 60 : 30)
      }));
    } else {
      setForm(prev => ({ ...prev, lotNumber: lotNum }));
    }
  };

  const handleTareWeightChange = (weight) => {
    setForm(prev => {
      const sacs = parseInt(prev.sacsCount) || 0;
      const factor = weight === "60 kgs" ? 60 : 30;
      return {
        ...prev,
        tareWeight: weight,
        quantity: sacs * factor
      };
    });
  };

  const handleSacsChange = (val) => {
    const sacs = parseInt(val) || 0;
    const factor = form.tareWeight === "60 kgs" ? 60 : 30;
    setForm(prev => ({
      ...prev,
      sacsCount: val,
      quantity: sacs * factor
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <FileSignature className="h-5 w-5 text-primary" /> Nouveau Contrat Commercial
          </DialogTitle>
          <DialogDescription>
            Veuillez saisir les coordonnées des parties et les détails de la vente basés sur le lot de café taxé.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* 1. INFORMATIONS GÉNÉRALES */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary border-b border-border pb-1">1. Informations Générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="lotSelect">No. du Lot *</Label>
                <select
                  id="lotSelect"
                  value={form.lotNumber}
                  onChange={(e) => handleLotChange(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none"
                  required
                >
                  <option value="">-- Sélectionner Lot --</option>
                  {taxationReports.map(r => (
                    <option key={r.id} value={r.lotNumber}>
                      {r.lotNumber} ({r.societe} - {r.qualite})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-muted-foreground">Sélectionnez le lot pour pré-remplir les données.</span>
              </div>

              <div className="space-y-1.5">
                <Label>Type de contrat *</Label>
                <div className="flex gap-4 h-9 items-center">
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="contractType"
                      value="Vente"
                      checked={form.contractType === "Vente"}
                      onChange={(e) => setForm(prev => ({ ...prev, contractType: e.target.value }))}
                      className="accent-primary"
                    />
                    Vente
                  </label>
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="contractType"
                      value="Achat"
                      checked={form.contractType === "Achat"}
                      onChange={(e) => setForm(prev => ({ ...prev, contractType: e.target.value }))}
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
                      checked={form.coffeeType === "Arabica"}
                      onChange={(e) => setForm(prev => ({ ...prev, coffeeType: e.target.value }))}
                      className="accent-primary"
                    />
                    Arabica
                  </label>
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="coffeeType"
                      value="Robusta"
                      checked={form.coffeeType === "Robusta"}
                      onChange={(e) => setForm(prev => ({ ...prev, coffeeType: e.target.value }))}
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
                  value={form.sellerName}
                  onChange={(e) => setForm(prev => ({ ...prev, sellerName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sellerNif">NIF de la société *</Label>
                <Input
                  id="sellerNif"
                  placeholder="Ex: 400012345-0"
                  value={form.sellerNif}
                  onChange={(e) => setForm(prev => ({ ...prev, sellerNif: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sellerPhone">Téléphone vendeur *</Label>
                <Input
                  id="sellerPhone"
                  type="tel"
                  placeholder="Téléphone"
                  value={form.sellerPhone}
                  onChange={(e) => setForm(prev => ({ ...prev, sellerPhone: e.target.value }))}
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
                  value={form.buyerName}
                  onChange={(e) => setForm(prev => ({ ...prev, buyerName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="buyerCountry">Pays de destination *</Label>
                <select
                  id="buyerCountry"
                  value={form.buyerCountry}
                  onChange={(e) => setForm(prev => ({ ...prev, buyerCountry: e.target.value }))}
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
                  value={form.buyerBp}
                  onChange={(e) => setForm(prev => ({ ...prev, buyerBp: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="buyerEmail">Email de contact *</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  placeholder="client@coffee.com"
                  value={form.buyerEmail}
                  onChange={(e) => setForm(prev => ({ ...prev, buyerEmail: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="buyerPhone">Téléphone acheteur *</Label>
                <Input
                  id="buyerPhone"
                  type="tel"
                  placeholder="Numéro de tel"
                  value={form.buyerPhone}
                  onChange={(e) => setForm(prev => ({ ...prev, buyerPhone: e.target.value }))}
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
                  value={form.unitPrice}
                  onChange={(e) => setForm(prev => ({ ...prev, unitPrice: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sacsCount">Nombre de sacs *</Label>
                <Input
                  id="sacsCount"
                  type="number"
                  placeholder="Ex: 85"
                  value={form.sacsCount}
                  onChange={(e) => handleSacsChange(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tareWeight">Poids tare / sac *</Label>
                <select
                  id="tareWeight"
                  value={form.tareWeight}
                  onChange={(e) => handleTareWeightChange(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
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
                  value={form.quantity}
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
                  value={form.deliveryDate}
                  onChange={(e) => setForm(prev => ({ ...prev, deliveryDate: e.target.value }))}
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
                  value={form.guaranteeAmount}
                  onChange={(e) => setForm(prev => ({ ...prev, guaranteeAmount: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="guaranteeType">Type de garantie *</Label>
                <select
                  id="guaranteeType"
                  value={form.guaranteeType}
                  onChange={(e) => setForm(prev => ({ ...prev, guaranteeType: e.target.value }))}
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
                  value={form.lotCount}
                  onChange={(e) => setForm(prev => ({ ...prev, lotCount: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Enregistrer le Contrat
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
