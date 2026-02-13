"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartColumn, List } from "lucide-react";
import AchatsListTable from "./achats-list-table";
import { fetchData } from "@/app/_utils/api";
import { TableSkeleton } from "@/components/ui/skeletons";

function AchatsData() {
  const [individualAchats, setIndividualAchats] = useState([]);
  const [associationAchats, setAssociationAchats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const getAchats = async () => {
      try {
        // setLoading(true);
        const response = await fetchData("get", "cafe/achat_cafe/", {
          params: { limit: limit, offset: pointer },
          additionalHeaders: {},
          body: {},
        });
        const response_associate = await fetchData(
          "get",
          "cafe/achat_cafe/get_achat_associations/",
          {
            params: { limit: limit, offset: pointer },
            additionalHeaders: {},
            body: {},
          },
        );

        const dataAchat = response?.results?.map((achat) => ({
          id: achat?.id,
          cultivator: {
            cultivator_id: achat?.cafeiculteur?.id,
            cultivator_code: achat?.cafeiculteur?.cultivator_code,
            first_name: achat?.cafeiculteur?.cultivator_first_name,
            last_name: achat?.cafeiculteur?.cultivator_last_name,
            image_url: achat?.cafeiculteur?.cultivator_photo,
            // Association fields
            cultivator_assoc_name: achat?.cafeiculteur?.cultivator_assoc_name,
            cultivator_assoc_rep_name:
              achat?.cafeiculteur?.cultivator_assoc_rep_name,
            cultivator_type: "personel",
          },
          sdl_ct: achat?.responsable?.sdl_ct?.sdl?.sdl_nom
            ? "SDL " + achat.responsable.sdl_ct.sdl.sdl_nom
            : "CT " + achat?.responsable?.sdl_ct?.ct?.ct_nom,

          society:
            achat?.responsable?.sdl_ct?.sdl?.societe?.nom_societe ||
            achat?.responsable?.sdl_ct?.ct?.sdl?.societe?.nom_societe,
          localite: {
            province:
              achat?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code
                ?.province_code?.province_name || "N/A",
            commune:
              achat?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code
                ?.commune_name || "N/A",
          },
          num_fiche: achat?.numero_fiche || "0",
          num_recu: achat?.numero_recu || "N/A",
          photo_fiche: achat?.photo_fiche,
          ca: achat?.quantite_cerise_a || 0,
          cb: achat?.quantite_cerise_b || 0,
          date: achat?.date_achat || "N/A",
          // Type identification
        }));
        const data_associate = response_associate?.results?.map((achat) => ({
          id: achat?.id,
          cultivator: {
            cultivator_code: achat?.cafeiculteur?.cultivator_code,
            image_url: achat?.cafeiculteur?.cultivator_photo,
            // Association fields
            cultivator_assoc_name: achat?.cafeiculteur?.cultivator_assoc_name,
            cultivator_assoc_rep_name:
              achat?.cafeiculteur?.cultivator_assoc_rep_name,
            cultivator_type: "association",
          },
          sdl_ct: achat?.responsable?.sdl_ct?.sdl?.sdl_nom
            ? "SDL " + achat.responsable.sdl_ct.sdl.sdl_nom
            : "CT " + achat?.responsable?.sdl_ct?.ct?.ct_nom,

          society:
            achat?.responsable?.sdl_ct?.sdl?.societe?.nom_societe ||
            achat?.responsable?.sdl_ct?.ct?.sdl?.societe?.nom_societe,
          localite: {
            province:
              achat?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code
                ?.province_code?.province_name || "N/A",
            commune:
              achat?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code
                ?.commune_name || "N/A",
          },
          num_fiche: achat?.numero_fiche || "0",
          num_recu: achat?.numero_recu || "N/A",
          photo_fiche: achat?.photo_fiche,
          ca: achat?.quantite_cerise_a || 0,
          cb: achat?.quantite_cerise_b || 0,
          date: achat?.date_achat || "N/A",
          // Type identification
        }));
        setIndividualAchats(dataAchat);
        setAssociationAchats(data_associate);
        setTotalCount(response?.count);
      } catch (error) {
        console.error("Error fetching achats data:", error);
      } finally {
        setLoading(false);
      }
    };

    getAchats();
  }, [limit, pointer]);
  const totalPages = Math.ceil(totalCount / limit);
  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPointer((pageNumber - 1) * limit);
  };
  const onLimitChange = (newLimit) => {
    setLimit(newLimit);
    //localStorage.setItem("table_limit", String(newLimit));
    setPointer(0);
    setCurrentPage(1);
  };

  const datapagination = {
    totalCount: totalCount,
    currentPage: currentPage,
    onPageChange: onPageChange,
    totalPages: totalPages,
    pointer: pointer,
    onLimitChange: onLimitChange,
    limit: limit,
  };
  const fetchCultivatorsByType = (type) => {
    console.log("Fetch cultivators of typeffff:", type);
  };
  return (
    <div className="p-4">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-full h-10 lg:w-[50%] hidden">
          {/* <TabsTrigger value="list">
            <List />
            <span>Liste</span>
          </TabsTrigger>
          <TabsTrigger value="details">
            <ChartColumn />
            <span>Analytics</span>
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="list">
          <h1 className="text-2xl font-semibold m-2">Liste des achats</h1>
          <AchatsListTable
            individualData={individualAchats}
            associationData={associationAchats}
            isCultivatorsPage={true}
            isLoading={loading}
            fetchCultivatorsByType={fetchCultivatorsByType}
            datapagination={datapagination}
            limit={limit}
            totalCount={totalCount}
          />
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
