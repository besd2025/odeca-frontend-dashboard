"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Warehouse } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabStocksInitiaux from "./tabs/tab-stocks-initiaux";
import TabNouveauLot from "./tabs/tab-nouveau-lot";
import TabStockNonPreleves from "./tabs/tab-stock-non-preleves";
import TabRapportTaxation from "./tabs/tab-rapport-taxation";
import TabLotsStockesTaxes from "./tabs/tab-lots-stockes-taxes";
import TabRetours from "./tabs/tab-retours";

export default function Stocks({ id, data = [] }) {
  const [activeTab, setActiveTab] = useState("account");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (val) => {
    setActiveTab(val);
  };

  return (
    <div className="space-y-4">
      {/* List Section */}
      <div className="w-full bg-sidebar p-2 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans les stocks..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
            />
          </div>
        </div>

        {/* All Tabs matching /odeca-production/usine/stockage exactly */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full md:w-max flex flex-nowrap overflow-x-auto justify-start h-10 p-1 bg-slate-100 dark:bg-slate-900 select-none mb-4 gap-1">
            <TabsTrigger value="initials" className="text-xs md:text-sm">
              Stocks initiaux
            </TabsTrigger>
            <TabsTrigger value="account" className="text-xs md:text-sm">
              Nouveau lot
            </TabsTrigger>
            <TabsTrigger value="password" className="text-xs md:text-sm">
              Stock non prélevés
            </TabsTrigger>
            {/* <TabsTrigger value="Taxation" className="text-xs md:text-sm">
              Rapport de taxation
            </TabsTrigger>
            <TabsTrigger value="stocked" className="text-xs md:text-sm">
              Lots Stockes & taxes
            </TabsTrigger>
            <TabsTrigger value="retours" className="text-xs md:text-sm">
              Retours
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="initials">
            <TabStocksInitiaux searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="account">
            <TabNouveauLot searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="password">
            <TabStockNonPreleves searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="Taxation">
            <TabRapportTaxation searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="stocked">
            <TabLotsStockesTaxes searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="retours">
            <TabRetours searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
