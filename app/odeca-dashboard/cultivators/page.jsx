import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartColumn, List } from "lucide-react";
import CultivatorsListTable from "@/app/ui/dashboard/cultivators/list";
import ProfilePage from "@/app/ui/dashboard/cultivators/profile/ProfilePage";

function page() {
  const cultivatorsData = [
    {
      id: "cultivator_001",
      cultivator: {
        cultivator_code: "2530-522-7545",
        first_name: "Brave",
        last_name: "Eddy",
        image_url: "/images/logo_1.jpg",
      },
      sdl_ct: "NGome",
      society: "ODECA",
      localite: {
        province: "Buja",
        commune: "Ntahangwa",
      },
      champs: 4,
    },
    {
      id: "cultivator_002",
      cultivator: {
        cultivator_code: "2530-522-7545",
        first_name: "jaa",
        last_name: "Eddy",
        image_url: "/images/logo_1.jpg",
      },
      sdl_ct: "aa",
      society: "ODECA",
      localite: {
        province: "Buja",
        commune: "Ntahangwa",
      },
      champs: 4,
    },
    {
      id: "cultivator_003",
      cultivator: {
        cultivator_code: "2530-56833",
        first_name: "yoo",
        last_name: "Eddy",
        image_url: "/images/logo_1.jpg",
      },
      sdl_ct: "NGome",
      society: "ODECA",
      localite: {
        province: "Buja",
        commune: "Ntahangwa",
      },
      champs: 4,
    },
  ];
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
          <h1 className="text-2xl font-semibold m-2">Liste des cultivateurs</h1>
          <CultivatorsListTable
            data={cultivatorsData}
            isCultivatorsPage={true}
          />
        </TabsContent>
        <TabsContent value="details">En cours...</TabsContent>
      </Tabs>
    </div>
  );
}

export default page;
