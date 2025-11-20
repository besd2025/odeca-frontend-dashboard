import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartColumn, List } from "lucide-react";
import CtsListTable from "@/app/ui/dashboard/ct/list";

function page() {
  return (
    <div className="p-4">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-full h-10 lg:w-[50%]">
          <TabsTrigger value="list">
            <List />
            <span>Liste</span>
          </TabsTrigger>
          <TabsTrigger value="details">
            <ChartColumn />
            <span>Details</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <h1 className="text-2xl font-semibold m-2">
            Liste des Centre de transits
          </h1>
          <CtsListTable />
        </TabsContent>
        <TabsContent value="details">En cours...</TabsContent>
      </Tabs>
    </div>
  );
}

export default page;
