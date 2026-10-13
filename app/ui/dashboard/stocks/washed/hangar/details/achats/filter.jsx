import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Mock data list of societes for filter (remplacera facilement l'API backend)
const MOCK_SOCIETES = [
  { id: "SOC001", nom: "SODEICO SARL" },
  { id: "SOC002", nom: "COPROTRAC" },
  { id: "SOC003", nom: "SUCAFINA BURUNDI" },
  { id: "SOC004", nom: "BUCAF COFFEE" },
  { id: "SOC005", nom: "INTERCAFE" },
];

const MOCK_QUALITES = ["Qualité A", "Qualité B", "Fully Washed", "Washed", "Grade 1", "Grade 2"];

function Filter({ handleFilter }) {
  const [open, setOpen] = React.useState(false);
  const [selectedSociete, setSelectedSociete] = React.useState("");
  const [selectedQualite, setSelectedQualite] = React.useState("");
  const [qteMin, setQteMin] = React.useState("");
  const [qteMax, setQteMax] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  const handleFiltersSubmit = (e) => {
    e.preventDefault();
    const filterData = {
      societe: selectedSociete,
      qualite: selectedQualite,
      qte_min: qteMin ? Number(qteMin) : null,
      qte_max: qteMax ? Number(qteMax) : null,
      date_from: dateFrom,
      date_to: dateTo,
    };
    handleFilter(filterData);
    setOpen(false);
  };

  const handleReset = () => {
    setSelectedSociete("");
    setSelectedQualite("");
    setQteMin("");
    setQteMax("");
    setDateFrom("");
    setDateTo("");
    handleFilter({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
          <svg
            className="stroke-current fill-white dark:fill-gray-800"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.29004 5.90393H17.7067"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.7075 14.0961H2.29085"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
              strokeWidth="1.5"
            />
            <path
              d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
              strokeWidth="1.5"
            />
          </svg>
          Filtrage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-sidebar">
        <DialogHeader>
          <DialogTitle>Filtrer les achats washed</DialogTitle>
        </DialogHeader>
        <div className="custom-scrollbar h-[60vh] lg:max-h-[450px] overflow-y-auto px-2 pb-3">
          <form onSubmit={handleFiltersSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Société</Label>
                <select
                  value={selectedSociete}
                  onChange={(e) => setSelectedSociete(e.target.value)}
                  className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Toutes les sociétés</option>
                  {MOCK_SOCIETES.map((soc) => (
                    <option key={soc.id} value={soc.nom}>
                      {soc.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Qualité</Label>
                <select
                  value={selectedQualite}
                  onChange={(e) => setSelectedQualite(e.target.value)}
                  className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Toutes les qualités</option>
                  {MOCK_QUALITES.map((qual, idx) => (
                    <option key={idx} value={qual}>
                      {qual}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Quantité Min (Kg)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 500"
                  value={qteMin}
                  onChange={(e) => setQteMin(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Quantité Max (Kg)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 10000"
                  value={qteMax}
                  onChange={(e) => setQteMax(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Depuis le</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Jusqu'au</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="mt-6 flex justify-between gap-2">
              <Button type="button" variant="outline" onClick={handleReset}>
                Réinitialiser
              </Button>
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Annuler
                  </Button>
                </DialogClose>
                <Button type="submit">Appliquer le filtre</Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Filter;
