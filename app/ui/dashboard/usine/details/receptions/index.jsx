"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import EnAttenteReception from "./en-attente";
import ConfirmedReception from "./confirme";
import { fetchData } from "@/app/_utils/api";
import { useSearchParams } from "next/navigation";

export default function Receptions({ data = [] }) {


  // Mock data handling
  const defaultData = React.useMemo(
    () => [
      {
        id: 1,
        date: "2024-05-15",
        proprietaire: "Coopérative KAWA",
        categorie: "Cerise Grade A",
        quantite: 5000,
        lot: "LOT-24-001",
        statut: "Validé",
        sdl: "SDL Ngozi"
      },
      {
        id: 2,
        date: "2024-05-16",
        proprietaire: "SOGESTAL",
        categorie: "Cerise Grade B",
        quantite: 3200,
        lot: "LOT-24-002",
        statut: "En attente",
      },
      {
        id: 3,
        date: "2024-05-18",
        proprietaire: "Coopérative KAWA",
        categorie: "Parche",
        quantite: 1500,
        lot: "LOT-24-003",
        statut: "Validé",
      },
    ],
    [],
  );
  const DEFAULT_RECEPTIONS = [
    {
      id: "LOT-2026-001",
      societe: "SOGESTAL Ngozi",
      sdls: ["SDL Ngozii"],
      dateTransfert: "2026-05-14",
      dateReception: "2026-05-15",
      poidsNet: 15000.00,
      status: "confirmé",
    }
  ];
  const TRIAGE_GRADES = [{ grade: "A1", poidsNet: 1000, status: "CONFIRMEE" }, { grade: "A2", poidsNet: 1000, status: "CONFIRMEE" }];
  const [gradesList, setGradesList] = React.useState(TRIAGE_GRADES);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [activeTab, setActiveTab] = useState("en attente");

  const [open, setOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  const [totalConfirmCount, setTotalConfirmCount] = useState(0);
  const [totalEnAttenteCount, setTotalEnAttenteCount] = useState(0);
  const handleTabChange = (val) => {
    setActiveTab(val);
  };

  React?.useEffect(() => {
    const loadDataForTab = async () => {
      setLoading(true);
      try {

        const confirmedRes = await fetchData("get", `cafe/transfert_sdl_usine/?usine_deparchage=${id}`, { params: { est_confirme: true, limit: 1 } });
        setTotalConfirmCount(confirmedRes?.count || 0);
        const enAttenteRes = await fetchData("get", `cafe/transfert_sdl_usine/?usine_deparchage=${id}`, { params: { est_confirme: false, limit: 1 } });
        setTotalEnAttenteCount(enAttenteRes?.count || 0);
      } catch (error) {
        console.error(`Error fetching data for tab:`, error);
      } finally {
        setLoading(false);
      }
    };


    loadDataForTab();
  }, [id]);

  return (
    <div className="">
      {/* List Section */}
      <div className="w-full bg-sidebar p-2 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5" />
            <Input
              placeholder="Rechercher par propriétaire..."
              onChange={(event) => {

              }}
              className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
            />
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex w-1/2 overflow-x-auto justify-start h-10 p-1 bg-slate-100 dark:bg-slate-900 select-none mb-4 gap-1">

            <TabsTrigger value="en attente" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>En attente ({totalEnAttenteCount})</span>
            </TabsTrigger>
            <TabsTrigger value="confirmé" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Confirmé ({totalConfirmCount})</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="en attente" className="">
            <EnAttenteReception />
          </TabsContent>
          <TabsContent value="confirmé" className="">
            <ConfirmedReception />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
