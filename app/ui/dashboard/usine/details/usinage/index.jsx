"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Search, Layers, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PretesUsinage from "./pretes-usinage";
import EnCoursUsinage from "./en-cours";
import FinaliseUsinage from "./finalise";
import { fetchData } from "@/app/_utils/api";

export default function Usinage({ id, data = [] }) {
  const [activeTab, setActiveTab] = useState("pretes");
  const [searchQuery, setSearchQuery] = useState("");
  const [usinagePretList, setUsinagePretList] = useState(0);
  const [usinageEnCoursList, setUsinageEnCoursList] = useState(0);
  const [usinageFinaliseList, setUsinageFinaliseList] = useState(0);
  const handleTabChange = (val) => {
    setActiveTab(val);
  };
  React?.useEffect(() => {
    const handleFetchData = async () => {
      //setLoading(true);
      try {
        const response = await fetchData("get", `cafe/transfert_sdl_usine_detail_comfimation/get_transfert_comfirmed_par_societe/`, { params: { usine_deparchage_id: id, etat_selection: "PRET_USINE", limit: 1 } });
        const response2 = await fetchData("get", `cafe/transfert_sdl_usine_detail_comfimation/get_transfert_comfirmed_par_societe/`, { params: { usine_deparchage_id: id, etat_selection: "EN_COURS", limit: 1 } });
        const response3 = await fetchData("get", `cafe/usinages/`, {
          params: {
            responsable_responsable_usineusine_id: id, processing_status: "TERMINE",
            limit: 1
          }
        });
        console.log("response3", response3);
        setUsinagePretList(response?.count);
        setUsinageEnCoursList(response2?.count);
        setUsinageFinaliseList(response3?.count);
      } catch (error) {
        console.error(`Error fetching data for tab pretes usinage:`, error);
      }
    };
    handleFetchData();

  }, [id]);

  return (
    <div className="">
      {/* List Section */}
      <div className="w-full bg-sidebar p-2 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 text-muted-foreground" />
            <Input
              placeholder="Rechercher par société, lot, sdl..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex w-full md:w-max overflow-x-auto justify-start h-10 p-1 bg-slate-100 dark:bg-slate-900 select-none mb-4 gap-1">
            <TabsTrigger
              value="pretes"
              className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              <span>Pretes à l'usinage ({usinagePretList || 0})</span>
            </TabsTrigger>

            <TabsTrigger
              value="encours"
              className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>En cours ({usinageEnCoursList || 0})</span>
            </TabsTrigger>

            <TabsTrigger
              value="finalise"
              className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Finalisé ({usinageFinaliseList || 0})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pretes">
            <PretesUsinage searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="encours">
            <EnCoursUsinage searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="finalise">
            <FinaliseUsinage searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
