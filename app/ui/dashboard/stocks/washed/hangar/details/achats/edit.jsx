"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SquarePen, Loader2 } from "lucide-react";
import { toast } from "sonner";

const MOCK_SOCIETES = [
  { id: "SOC001", nom: "SODEICO SARL" },
  { id: "SOC002", nom: "COPROTRAC" },
  { id: "SOC003", nom: "SUCAFINA BURUNDI" },
  { id: "SOC004", nom: "BUCAF COFFEE" },
  { id: "SOC005", nom: "INTERCAFE" },
];

const MOCK_QUALITES = ["Qualité A", "Qualité B", "Fully Washed", "Washed", "Grade 1", "Grade 2"];

export default function Edit({ id, item, onSave }) {
  const [open, setOpen] = React.useState(false);
  const [societe, setSociete] = React.useState(item?.societe || "SODEICO SARL");
  const [hangar, setHangar] = React.useState(item?.hangar || "Hangar");
  const [quantiteWashed, setQuantiteWashed] = React.useState(item?.quantite_washed || 1250);
  const [qualite, setQualite] = React.useState(item?.qualite || "Qualité A");
  const [date, setDate] = React.useState(item?.date || "2026-07-28");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (item) {
      setSociete(item.societe || "SODEICO SARL");
      setQuantiteWashed(item.quantite_washed || 1250);
      setQualite(item.qualite || "Qualité A");
      setDate(item.date || "2026-07-28");
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      id: id || item?.id,
      societe,
      quantite_washed: Number(quantiteWashed),
      qualite,
      date,
    };

    // Simulation de l'appel API pour l'intégration future par l'utilisateur
    // TODO API: Interroger le backend e.g. await fetchData("patch", `cafe/achat_washed/${id}/`, { body: updatedData })
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(`L'achat #${id || updatedData.id} a été modifié avec succès`);
      if (onSave) {
        onSave(updatedData);
      }
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="w-full justify-start font-normal text-sm"
        >
          <SquarePen className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-sidebar">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier l'achat de café washed</DialogTitle>
            <DialogDescription>
              Ajustez les informations de la société, quantité washed, qualité ou date.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Société</Label>

              <Input
                type="name"
                value={societe}
                onChange={(e) => setSociete(e.target.value)}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>Hangar</Label>

              <Input
                type="text"
                value={hangar}
                onChange={(e) => setHangar(e.target.value)}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>Quantité Washed (Kg)</Label>
              <Input
                type="number"
                value={quantiteWashed}
                onChange={(e) => setQuantiteWashed(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Qualité</Label>
              <select
                value={qualite}
                onChange={(e) => setQualite(e.target.value)}
                className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {MOCK_QUALITES.map((q, idx) => (
                  <option key={idx} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
