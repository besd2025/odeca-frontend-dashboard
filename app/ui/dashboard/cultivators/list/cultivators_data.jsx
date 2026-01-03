"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartColumn, List } from "lucide-react";
import CultivatorsListTable from "@/app/ui/dashboard/cultivators/list";
import ProfilePage from "@/app/ui/dashboard/cultivators/profile/ProfilePage";
import { fetchData } from "@/app/_utils/api";
import CultivatorAnalytics from "../analytics";

function CultivatorData() {
  const [individualData, setIndividualData] = useState([]);
  const [associationData, setAssociationData] = useState([]);

  useEffect(() => {
    const getCultivators = async () => {
      try {
        // Fetch Individuals
        const responseIndividuals = await fetchData(
          "get",
          "cultivators/get_cafe_cultivators/?cafeiculteur_type=personne",
          {
            params: { limit: 1000, offset: 0 },
            additionalHeaders: {},
            body: {},
          }
        );

        // Fetch Associations
        const responseAssociations = await fetchData(
          "get",
          "cultivators/get_cafe_cultivators/?cafeiculteur_type=association",
          {
            params: { limit: 1000, offset: 0 },
            additionalHeaders: {},
            body: {},
          }
        );

        const formatData = (results) => {
          return results.map((cultivator) => ({
            id: cultivator.id,
            cultivator: {
              cultivator_code: cultivator?.cultivator_code,
              first_name: cultivator?.cultivator_first_name,
              last_name: cultivator?.cultivator_last_name,
              image_url: cultivator?.cultivator_photo,
              // Association specific fields
              cultivator_assoc_name: cultivator?.cultivator_assoc_name,
              cultivator_assoc_rep_name: cultivator?.cultivator_assoc_rep_name,
              cultivator_assoc_nif: cultivator?.cultivator_assoc_nif,
              cultivator_assoc_rep_phone:
                cultivator?.cultivator_assoc_rep_phone,
              cultivator_assoc_numero_fiche:
                cultivator?.cultivator_assoc_numero_fiche,
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
        };

        if (responseIndividuals?.results) {
          setIndividualData(formatData(responseIndividuals.results));
        }
        if (responseAssociations?.results) {
          setAssociationData(formatData(responseAssociations.results));
        }
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
          <CultivatorsListTable
            individualData={individualData}
            associationData={associationData}
            isCultivatorsPage={true}
          />
        </TabsContent>
        <TabsContent value="details">
          <CultivatorAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CultivatorData;
