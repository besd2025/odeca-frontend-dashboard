"use client";

import React, { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const STOCKED_LOTS = [
    {
        id: "STOCK-2026-001",
        societe: "SOGESTAL Ngozi",
        grades: [
            { name: "FW NGOMA MILD-SDL", trie_qty: 118, directStock_qty: 240 },
            { name: "FW AA", trie_qty: 20, directStock_qty: 50 },
            { name: "W ABC", trie_qty: 0, directStock_qty: 150 },
        ],
    },
];

// STOCKED_LOTS contains lots with nested grade objects.
export default function StockageForm({ onCancel, onStore }) {
    const candidates = useMemo(
        () =>
            STOCKED_LOTS.flatMap((lot) =>
                lot.grades.map((gradeItem, index) => ({
                    id: `${lot.id}-${gradeItem.name}-${index}`,
                    societe: lot.societe,
                    sdl: lot.sdls?.[0] ?? "",
                    grade: gradeItem.name,
                    trie_qty: gradeItem.trie_qty,
                    directStock_qty: gradeItem.directStock_qty,
                    qty: (gradeItem.trie_qty || 0) + (gradeItem.directStock_qty || 0),
                }))
            ),
        []
    );

    const societeOptions = useMemo(() => {
        return Array.from(new Set(candidates.map((c) => c.societe)));
    }, [candidates]);

    const [societe, setSociete] = useState(societeOptions[0] || "");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [lotNumber, setLotNumber] = useState("");

    const filtered = useMemo(() => {
        return candidates.filter((c) => c.societe === societe && (!selectedGrade || c.grade === selectedGrade));
    }, [candidates, societe, selectedGrade]);

    const gradesForSociete = useMemo(() => {
        const grades = new Set();
        candidates.filter((c) => c.societe === societe).forEach((c) => grades.add(c.grade));
        return Array.from(grades);
    }, [candidates, societe]);

    const toggleSelect = (id, grade) => {
        const already = selectedIds.includes(id);
        if (!already) {
            const otherGrade = selectedIds.length > 0 ? candidates.find((c) => c.id === selectedIds[0])?.grade : null;
            if (otherGrade && otherGrade !== grade) {
                toast.error("Une seule qualité par formulaire est autorisée. Désélectionnez d'abord les autres entrées.");
                return;
            }
        }
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const totalSacs = selectedIds.reduce((sum, id) => {
        const c = candidates.find((x) => x.id === id);
        return sum + (c ? Number(c.qty || 0) : 0);
    }, 0);

    const selectedGradeName = selectedIds.length > 0 ? candidates.find((x) => x.id === selectedIds[0])?.grade : selectedGrade;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!societe) return toast.error("Sélectionnez une société.");
        if (!selectedGradeName) return toast.error("Sélectionnez une qualité.");
        if (selectedIds.length === 0) return toast.error("Cochez au moins une entrée à stocker.");

        if (totalSacs < 320) {
            return toast.warning(` Lot incomplet stocké (${totalSacs} sacs, ${selectedGradeName}).`);
        }

        const lot = {
            id: lotNumber || `STOCK-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
            societe,
            grades: { [selectedGradeName]: totalSacs },
            nombreSacs: totalSacs,
            dateStockage: new Date().toISOString().split("T")[0],
        };

        onStore?.(lot);
        toast.success(`Lot ${lot.id} stocké (${totalSacs} sacs, ${selectedGradeName}).`);
        // reset
        setSelectedIds([]);
        setLotNumber("");
        onCancel?.();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row md:gap-4">
                <div>
                    <Label className="text-sm font-semibold">Société</Label>
                    <Select onValueChange={setSociete} value={societe}>
                        <SelectTrigger className="h-9">
                            <SelectValue placeholder="Sélectionner une société" />
                        </SelectTrigger>
                        <SelectContent>
                            {societeOptions.map((s) => (
                                <SelectItem key={s} value={s} className="text-sm">
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="text-sm font-semibold">Qualité (filtre)</Label>
                    <Select onValueChange={(v) => { setSelectedGrade(v); setSelectedIds([]); }} value={selectedGrade}>
                        <SelectTrigger className="h-9">
                            <SelectValue placeholder="Filtrer par qualité" />
                        </SelectTrigger>
                        <SelectContent>
                            {gradesForSociete.map((g) => (
                                <SelectItem key={g} value={g} className="text-sm">
                                    {g}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>


            <div>
                <Label className="text-sm font-semibold mb-2">Entrées disponibles</Label>
                <div className="border rounded-md p-2 space-y-2 max-h-48 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="text-sm text-slate-500">Aucune entrée correspondante.</div>
                    ) : (
                        filtered.map((c) => (
                            <div key={c.id} className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-3 last:border-b-0 last:pb-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id={`cand-${c.id}`}
                                            checked={selectedIds.includes(c.id)}
                                            onCheckedChange={() => toggleSelect(c.id, c.grade)}
                                        />
                                        <div className="text-sm">
                                            <div className="font-semibold">{c.grade}</div>
                                            <div className="text-xs text-slate-500">{c.societe} • {c.sdl}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold">{c.qty} sacs</div>
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                    <span>Trié : {c.trie_qty} sacs</span>
                                    <span>Stockage direct : {c.directStock_qty} sacs</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xs text-slate-600">Qualité sélectionnée</div>
                    <div className="font-semibold">{selectedGradeName || "—"}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-600">Total sacs</div>
                    <div className="font-semibold">{totalSacs} sacs</div>
                </div>
            </div>

            <div>
                {totalSacs < 320 ? (
                    <div className="text-sm text-red-600">
                        Lot incomplet
                    </div>
                ) : <>
                    <div className="text-sm text-green-600 mb=2">
                        Lot complet - un numéro de lot peut être attribué
                    </div>
                    <Label className="text-sm font-semibold">Attribuer numéro de lot</Label>
                    <Input
                        placeholder="Ex: STOCK-2026-010"
                        value={lotNumber}
                        onChange={(e) => setLotNumber(e.target.value)}
                    />
                </>}

            </div>

            <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" type="button" onClick={onCancel}>Annuler</Button>
                <Button type="submit" className="bg-primary text-white">Stocker</Button>
            </div>
        </form>
    );
}
