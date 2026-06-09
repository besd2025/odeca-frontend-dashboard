"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const SOCIETES = [
  "SOGESTAL Ngozi",
  "SOGESTAL Kayanza",
  "COCOCA",
  "SOGESTAL Mumirwa",
  "SOGESTAL Kirundo-Muyinga",
];

const GRADES = [
  "FW NGOMA MILD-SDL",
  "FW AA",
  "15+",
  "PB",
  "FW TT",
  "W ABC",
  "W TT",
  "W STOCK LOT",
  "GRADE 1",
  "GRADE 2",
  "ROBUSTA NATURAL CLEAN SUPER",
  "COQUE"
];

export default function StockageForm({ onCancel, onStore }) {
  const [societe, setSociete] = useState(SOCIETES[0]);
  const [grade, setGrade] = useState(GRADES[0]);
  const [nombreSacs, setNombreSacs] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [dateStockage, setDateStockage] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!societe) return toast.error("Sélectionnez une société.");
    if (!grade) return toast.error("Sélectionnez un grade.");
    if (!nombreSacs || parseInt(nombreSacs) <= 0) {
      return toast.error("Veuillez renseigner un nombre de sacs valide.");
    }

    const newLot = {
      id: lotNumber || `STOCK-2026-${Math.floor(Math.random() * 900 + 100)}`,
      societe,
      grades: { [grade]: parseInt(nombreSacs) },
      nombreSacs: parseInt(nombreSacs),
      dateStockage,
    };

    if (onStore) {
      onStore(newLot);
    }
    toast.success(`Lot ${newLot.id} enregistré avec succès !`);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        Nouveau Stockage d'un Lot
      </h3>
      
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Société / Propriétaire</Label>
        <Select onValueChange={setSociete} value={societe}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Sélectionner une société" />
          </SelectTrigger>
          <SelectContent>
            {SOCIETES.map((s) => (
              <SelectItem key={s} value={s} className="text-sm">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Grade / Qualité</Label>
        <Select onValueChange={setGrade} value={grade}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Sélectionner un grade" />
          </SelectTrigger>
          <SelectContent>
            {GRADES.map((g) => (
              <SelectItem key={g} value={g} className="text-sm">
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Nombre de sacs</Label>
        <Input
          type="number"
          min="1"
          placeholder="Ex: 150"
          value={nombreSacs}
          onChange={(e) => setNombreSacs(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Numéro de Lot (Optionnel)</Label>
        <Input
          placeholder="Ex: STOCK-2026-105 (laissé vide pour génération auto)"
          value={lotNumber}
          onChange={(e) => setLotNumber(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Date de Stockage</Label>
        <Input
          type="date"
          value={dateStockage}
          onChange={(e) => setDateStockage(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-primary text-white">
          Stocker
        </Button>
      </div>
    </form>
  );
}
