import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartColumn, List } from "lucide-react";
import SdlsListTable from "@/app/ui/dashboard/sdl/list";
import SdlAnalytics from "@/app/ui/dashboard/sdl/analytics";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SOCIETE, ROLES.SUPERVISEUR_REGIONAL]}>
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
              Liste des Station de Lavage
            </h1>
            <SdlsListTable />
          </TabsContent>
          <TabsContent value="details">
            <SdlAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}

export default page;
