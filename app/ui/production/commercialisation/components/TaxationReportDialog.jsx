import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scale, Award, FileText, Printer } from "lucide-react";

export default function TaxationReportDialog({
  isOpen,
  onOpenChange,
  selectedReport,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                <p>
                  <span className="font-bold text-slate-500">PROPRIÉTAIRE :</span> <span className="font-bold">{selectedReport.societe}</span>
                </p>
                <p>
                  <span className="font-bold text-slate-500">ORIGINE / USINE :</span> <span>{selectedReport.deparcheur}</span>
                </p>
                <p>
                  <span className="font-bold text-slate-500">NUMÉRO DE LOT :</span> <span className="font-bold">{selectedReport.lotNumber}</span>
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p>
                  <span className="font-bold text-slate-500">VOLUME REPRÉSENTÉ :</span> <span>{selectedReport.sacsCount} sacs ({selectedReport.qteEchantillon.toFixed(2)} kg)</span>
                </p>
                <p>
                  <span className="font-bold text-slate-500">CLASSIFICATION PROPRIÉTÉ :</span> <span className="font-semibold">{selectedReport.qualite}</span>
                </p>
              </div>
            </div>

            {/* Technical results table */}
            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 flex items-center gap-1">
                <Scale className="h-3.5 w-3.5 text-primary" /> 1. ANALYSE PHYSIQUE ET MÉCANIQUE (GRANULOMÉTRIE)
              </h3>
              <div className="grid grid-cols-6 gap-2 text-center text-xs">
                <div className="border border-slate-200 p-2 rounded bg-slate-50">
                  <span className="block font-bold text-slate-500">7.1 mm</span>
                  <span className="font-bold">{selectedReport.granulometrie?.sieve_7_1.toFixed(1)}%</span>
                </div>
                <div className="border border-slate-200 p-2 rounded bg-slate-50">
                  <span className="block font-bold text-slate-500">6.3 mm</span>
                  <span className="font-bold">{selectedReport.granulometrie?.sieve_6_3.toFixed(1)}%</span>
                </div>
                <div className="border border-slate-200 p-2 rounded bg-slate-50">
                  <span className="block font-bold text-slate-500">5.5 mm</span>
                  <span className="font-bold">{selectedReport.granulometrie?.sieve_5_5.toFixed(1)}%</span>
                </div>
                <div className="border border-slate-200 p-2 rounded bg-slate-50">
                  <span className="block font-bold text-slate-500">4.0 mm</span>
                  <span className="font-bold">{selectedReport.granulometrie?.sieve_4_0.toFixed(1)}%</span>
                </div>
                <div className="border border-slate-200 p-2 rounded bg-slate-50">
                  <span className="block font-bold text-slate-500">3.0 mm</span>
                  <span className="font-bold">{selectedReport.granulometrie?.sieve_3_0.toFixed(1)}%</span>
                </div>
                <div className="border border-slate-200 p-2 rounded bg-slate-50">
                  <span className="block font-bold text-slate-500">Fond</span>
                  <span className="font-bold">{selectedReport.granulometrie?.fond.toFixed(1)}%</span>
                </div>
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
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
