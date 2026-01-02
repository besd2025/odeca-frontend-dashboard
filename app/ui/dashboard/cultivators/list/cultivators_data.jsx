"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartColumn, List } from "lucide-react";
import CultivatorsListTable from "@/app/ui/dashboard/cultivators/list";
import ProfilePage from "@/app/ui/dashboard/cultivators/profile/ProfilePage";
import { fetchData } from "@/app/_utils/api";
import CultivatorAnalytics from "../analytics";

function CultivatorData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getCultivators = async () => {
      try {
        const response = await fetchData(
          "get",
          "cultivators/get_cafe_cultivators/?cafeiculteur_type=personne",
          {
            params: { limit: 1000, offset: 0 },
            additionalHeaders: {},
            body: {},
          }
        );
        const results = response?.results;
        console.log("data cultivators: ", results);
        const cultivatorsData = results.map((cultivator) => ({
          id: cultivator.id,
          cultivator: {
            cultivator_code: cultivator?.cultivator_code,
            first_name: cultivator?.cultivator_first_name,
            last_name: cultivator?.cultivator_last_name,
            image_url: cultivator?.cultivator_photo,
          },
          sdl_ct: cultivator?.ct_sdl_name,
          society: cultivator?.societe_name,
          localite: {
            province:
              cultivator?.cultivator_adress?.zone_code?.commune_code
                ?.province_code?.province_name,
            commune:
              cultivator?.cultivator_adress?.zone_code?.commune_code
                ?.commune_name,
          },
          champs: cultivator?.nombre_champs,
        }));

        setData(cultivatorsData);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };

    getCultivators();
  }, []);

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
          <CultivatorsListTable data={data} isCultivatorsPage={true} />
        </TabsContent>
        <TabsContent value="details">
          <CultivatorAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CultivatorData;
