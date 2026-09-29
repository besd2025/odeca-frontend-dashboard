"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Search, ClipboardList, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PretATrier from "./pret-a-trier";
import EnCoursTriage from "./en-cours";
import TrieStocke from "./trie-stocke";

export default function Triage({ id, data = [] }) {
  const [activeTab, setActiveTab] = useState("pret");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (val) => {
    setActiveTab(val);
  };

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
              value="pret"
              className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer"
            >
              <ClipboardList className="h-3.5 w-3.5 text-blue-500" />
              <span>Prêt à trier (2)</span>
            </TabsTrigger>

            <TabsTrigger
              value="encours"
              className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 text-amber-500" />
              <span>En cours de triage (1)</span>
            </TabsTrigger>

            <TabsTrigger
              value="trie"
              className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
              <span>Trié (2)</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pret">
            <PretATrier searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="encours">
            <EnCoursTriage searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="trie">
            <TrieStocke searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
