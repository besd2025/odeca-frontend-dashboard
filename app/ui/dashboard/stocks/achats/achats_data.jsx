"use client";
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import AchatsListTable from "./achats-list-table";

function AchatsData() {
  return (
    <div className="p-4">
      <Tabs defaultValue="list" className="w-full">
        <TabsContent value="list">
          <h1 className="text-2xl font-semibold m-2">Liste des achats</h1>
          <AchatsListTable isCultivatorsPage={true} />
        </TabsContent>
        <TabsContent value="details">
          <div className="p-4 border rounded-lg bg-background text-center">
            Analytics for Achats coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AchatsData;
