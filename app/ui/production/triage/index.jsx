"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { toast } from "sonner";
import TriageList from "./TriageList";
import TriageDialog from "./TriageDialog";
import StartTriageForm from "./StartTriageForm";
import { fetchData } from "@/app/_utils/api";
// Sample lots from usinage outputs, ready for triage
const INITIAL_LOTS = [
  {
    id: "TRI-2026-001",
    societe: "SOGESTAL Ngozi",
    sdls: ["SDL Ngozi", "SDL Gitega"],
    grades: { "FW NGOMA MILD-SDL": 120, "FW AA": 80, "W ABC": 20 },
    dateEntree: "2026-05-18",
    dateSortie: "2026-05-20",
    status: "Trié & Stocké",
    taxationQuantities: { "FW NGOMA MILD-SDL": 420, "FW AA": 78, "W ABC": 20 },
    remainingQuantities: { "FW NGOMA MILD-SDL": 420, "FW AA": 78, "W ABC": 20 },
  },
  {
    id: "TRI-2026-002",
    societe: "SOGESTAL Kayanza",
    sdls: ["SDL Kayanza"],
    grades: { "FW AA": 40, "15+": 20 },
    dateEntree: "2026-05-27",
    dateSortie: null,
    status: "En cours de triage",
  },
  {
    id: "TRI-2026-003",
    societe: "COCOCA",
    sdls: ["SDL Gitega", "SDL Karusi"],
    grades: { "ROBUSTA NATURAL CLEAN SUPER": 58, "FW NGOMA MILD-SDL": 420, "FW AA": 78, "W ABC": 20 },
    dateEntree: null,
    dateSortie: null,
    status: "Prêt à trier",
  },
  {
    id: "TRI-2026-004",
    societe: "SOGESTAL Mumirwa",
    sdls: ["SDL Muramvya"],
    grades: { "GRADE 1": 18 },
    dateEntree: null,
    dateSortie: null,
    status: "Prêt à trier",
  },
  {
    id: "TRI-2026-005",
    societe: "SOGESTAL Ngozi",
    sdls: ["SDL Gitega"],
    grades: { "W ABC": 3 },
    dateEntree: "2026-05-28",
    dateSortie: "2026-05-28",
    status: "Trié & Tri non requis",
    remainingQuantities: { "W ABC": 3 },
  },
];

export default function TriagePage() {
  const [lots, setLots] = useState(INITIAL_LOTS);
  const [activeLot, setActiveLot] = useState(null);
  const [isStartingTriage, setIsStartingTriage] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);

  // Open start triage dialog to configure sorted grades vs direct store
  const handleStartTriage = (lot) => {
    setActiveLot(lot);
    setIsStartingTriage(true);
  };

  // Confirm start triage selection and update lot status and quantities
  const handleConfirmStartTriage = (lot, gradesATrier, gradesStockesDirect, dateEntree) => {
    if (!lot?.id) {
      toast.error("Impossible de démarrer le triage : lot non défini.");
      return;
    }


    setLots((prev) =>
      prev.map((l) => {
        if (l.id === lot.id) {
          const taxationQuantities = { ...l.taxationQuantities };
          // Pre-fill initial quantities for grades stored directly
          gradesStockesDirect.forEach((grade) => {
            taxationQuantities[grade] = l.grades[grade];
          });

          return {
            ...l,
            status: "En cours de triage",
            dateEntree,
            gradesATrier,
            gradesStockesDirect,
            taxationQuantities,
          };
        }
        return l;
      })
    );
    setIsStartingTriage(false);
    setActiveLot(null);
    toast.success(`Triage lancé pour le lot ${lot.id}`);
  };

  // Direct label without sorting
  const handleLabelDirect = (lot) => {
    const today = new Date().toISOString().split("T")[0];
    setLots((prev) =>
      prev.map((l) =>
        l.id === lot.id
          ? {
            ...l,
            status: "Trié & Tri non requis",
            dateEntree: today,
            dateSortie: today,
            remainingQuantities: { ...l.grades },
          }
          : l
      )
    );
    toast.success(`Lot ${lot.id} étiqueté et disponible pour stockage direct.`);
  };

  // Open finalize dialog
  const handleFinalize = (lot) => {
    setActiveLot(lot);
    setIsFinalizing(true);
  };

  // Open details dialog
  const handleViewDetails = (lot) => {
    setActiveLot(lot);
    setIsViewingDetails(true);
  };

  // Save finalized triage data
  const handleSaveTriage = (lotId, outputData) => {
    setLots((prev) =>
      prev.map((l) => {
        if (l.id === lotId) {
          const updatedLot = { ...l, ...outputData };
          // Initialize remainingQuantities from the taxationQuantities that were input
          updatedLot.remainingQuantities = { ...outputData.taxationQuantities };
          return updatedLot;
        }
        return l;
      })
    );
    setIsFinalizing(false);
    setActiveLot(null);
    toast.success("Triage validé et lot disponible pour stockage !");
  };

  // Handle stocking a grade
  const handleStockGrade = (lotId, grade, bagsToStore, lotNumbers) => {
    setLots((prevLots) =>
      prevLots.map((l) => {
        if (l.id === lotId) {
          const sourceQuantities = l.status === "Trié & Stocké" ? l.taxationQuantities : l.grades;
          const currentRemaining = l.remainingQuantities !== undefined ? l.remainingQuantities : { ...sourceQuantities };
          const updatedRemaining = {
            ...currentRemaining,
            [grade]: Math.max(0, (currentRemaining[grade] || 0) - bagsToStore),
          };
          return {
            ...l,
            remainingQuantities: updatedRemaining,
          };
        }
        return l;
      })
    );
    toast.success(`Grade ${grade} enregistré en stockage sous le(s) numéro(s) de lot: ${lotNumbers.join(", ")}`);
  };


  // const fetchLots = async () => {
  //   try {
  //     const data = await fetchData("get", `cafe/triage/get_termine_triage`);
  //     const lotsData = data.results || data || [];
  //     const formattedLots = lotsData.map(item => ({


  //       id: item?.id,
  //       societe: item?.nom_societe,
  //       sdls: [],
  //       grades: item?.productions,
  //       dateEntree: item?.date_entree,
  //       dateSortie: item?.date_sortie,
  //       status: item?.statut,
  //       taxationQuantities: item?.production_quantities,
  //       remainingQuantities: item?.production_quantities,
  //     }));
  //     setLots(formattedLots);
  //     console.log("formattedLots ", formattedLots);
  //   } catch (error) {
  //     console.error("Error fetching lots:", error);
  //   }
  // };

  // React.useEffect(() => {
  //   fetchLots();
  // }, []);




  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SUPERVISEUR]}>
      <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="h-8 w-8 text-primary" /> Processus de Triage
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Suivi et validation des lots de café prêts à être triés, en cours de triage et étiquetés/stockés.
            </p>
          </div>
        </div>

        {/* Component 1: Triage List */}
        <TriageList
          lots={lots}
          onStartTriage={handleStartTriage}
          onLabelDirect={handleLabelDirect}
          onFinalize={handleFinalize}
          onViewDetails={handleViewDetails}
          onStockGrade={handleStockGrade}
        />


        {/* Component 2a: Finalize triage dialog */}
        <Dialog open={isFinalizing} onOpenChange={setIsFinalizing}>
          <DialogContent className="sm:max-w-4xl md:max-w-4xl lg:max-w-[80vw] bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Finalisation du Triage
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                Saisissez la chronologie et les quantités triées prêtes à être taxées par grade.
              </DialogDescription>
            </DialogHeader>
            {activeLot && (
              <TriageDialog
                lot={activeLot}
                onSave={handleSaveTriage}
                onCancel={() => { setIsFinalizing(false); setActiveLot(null); }}
                readOnly={false}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Component 2b: View details dialog */}
        <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
          <DialogContent className="sm:max-w-4xl md:max-w-4xl lg:max-w-[80vw] bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Fiche Récapitulative du Triage
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                Détail complet du lot trié, des quantités taxables et de la chronologie du processus.
              </DialogDescription>
            </DialogHeader>
            {activeLot && (
              <TriageDialog
                lot={activeLot}
                onCancel={() => { setIsViewingDetails(false); setActiveLot(null); }}
                readOnly={true}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Component 2c: Start triage configuration dialog */}
        <Dialog open={isStartingTriage} onOpenChange={setIsStartingTriage}>
          <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto bg-sidebar border border-slate-200 dark:border-slate-800 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Démarrer le Triage - Configuration du Lot
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                Sélectionnez les grades à trier pour le lot {activeLot?.id}. Les autres grades seront stockés directement.
              </DialogDescription>
            </DialogHeader>
            {activeLot && (
              <StartTriageForm
                lot={activeLot}
                onConfirm={handleConfirmStartTriage}
                onCancel={() => {
                  setIsStartingTriage(false);
                  setActiveLot(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

      </div>
    </ProtectedRoute>
  );
}
