"use client";

import { User, Users } from "lucide-react";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IndividualAchatsTable from "./IndividualAchatsTable";
import AssociationAchatsTable from "./AssociationAchatsTable";

export default function AchatsListTable({ isCultivatorsPage }) {
  return (
    <Tabs defaultValue="individual" className="w-full mt-4">
      <TabsList className="p-0 h-auto bg-background gap-1">
        <TabsTrigger
          value="individual"
          className="data-[state=active]:shadow-[0_0_8px_1px_rgba(0,0,0,0.1)] dark:data-[state=active]:shadow-[0_0_8px_1px_rgba(255,255,255,0.2)]"
        >
          <User />
          Physiques
        </TabsTrigger>
        <TabsTrigger
          value="association"
          className="data-[state=active]:shadow-[0_0_8px_1px_rgba(0,0,0,0.1)] dark:data-[state=active]:shadow-[0_0_8px_1px_rgba(255,255,255,0.2)]"
        >
          <Users />
          Associations / Coopératives
        </TabsTrigger>
      </TabsList>

      <TabsContent value="individual" className="mt-4">
        <IndividualAchatsTable isCultivatorsPage={isCultivatorsPage} />
      </TabsContent>
      <TabsContent value="association" className="mt-4">
        <AssociationAchatsTable isCultivatorsPage={isCultivatorsPage} />
      </TabsContent>
    </Tabs>
  );
}
