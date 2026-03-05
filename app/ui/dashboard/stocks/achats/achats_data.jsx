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
  const [achat_type, setAchat_type] = useState("achat_cultivator_individual");
  const [filterData, setFilterData] = useState({});
const [serch, setSerch] = useState("");
  useEffect(() => {
    const getAchats = async () => {
      try {
        const response = await fetchData("get", "cafe/achat_cafe/", {
          params: { limit: limit, offset: pointer, ...filterData,search:serch },
          additionalHeaders: {},
          body: {},
        });

        const response_associate = await fetchData(
          "get",
          "cafe/achat_cafe/get_achat_associations/",
          {
            params: {
              limit: limit,
              offset: pointer,
              ...filterData,
              search: serch,
            },
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
        if (achat_type === "achat_cultivator_individual") {
          setIndividualAchats(dataAchat);
          setTotalCount(response?.count);
          setAssociationAchats([]);
        } else if (achat_type === "achat_cultivator_association") {
          setAssociationAchats(data_associate);
          setTotalCount(response_associate?.count);
          setIndividualAchats([]);
        }
      } catch (error) {
        console.error("Error fetching achats data:", error);
      } finally {
        setLoading(false);
      }
    };

    getAchats();
  }, [limit, pointer, achat_type, filterData,serch]);
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
    setAchat_type(type);
  };
  const handleFilter = (filterData) => {
    const formattedFilterData = {
      date_achat_min: filterData.dateAchatFrom,
      date_achat_max: filterData.dateAchatTo,
      enregistrement_min: filterData.dateDebutEnregistre,
      enregistrement_max: filterData.dateFinEnregistre,
      quantite_a_min: filterData.qteMinCA,
      quantite_a_max: filterData.qteMaxCA,
      quantite_b_min: filterData.qteMinCB,
      quantite_b_max: filterData.qteMaxCB,
      province: filterData.province,
      commune: filterData.commune,
      zone: filterData.zone,
      colline: filterData.colline,
    };

    setFilterData(formattedFilterData);
  };

  const hendlesecherchData=(value)=>{
setSerch(value)
  }
  useEffect(() => {
    // Réinitialiser la pagination lorsque le type de cultivateur change
    setCurrentPage(1);
    setPointer(0);
  }, [achat_type]);



  const [reportId, setReportId]=useState("")
      const [LoadingEportBtn, setLoadingEportBtn] = useState(false);
      const [ActivedownloadBtn, setActivedownloadBtn] = useState(false);
  const exportCultivatorsToExcel = async () => {
      setLoadingEportBtn(true);
      try {
        // Étape 1 : Récupérer le nombre total d'enregistrements
        const initial_export = await fetchData(
          "post",
          "/cafe/achat_cafe/export_achat_quantites/",
          {
            params: {},
            additionalHeaders: {},
            body: { cafeiculteur_type: "personne", export_type: "DETAIL" },
          },
        );
        if (initial_export.data?.status == "PENDING") {
          setLoadingEportBtn(true);
          const task_id = initial_export?.data?.report_id;
          const intervalId = setInterval(async () => {
            const export_excel = await fetchData(
              "get",
              "cafe/achat_cafe/export_achat_status/",
              {
                params: { report_id: task_id },
              },
            );
            if (export_excel.status === "SUCCESS") {
              clearInterval(intervalId); // Arrêtez l'intervalle
              // setLoadingEportBtn(false);
              DownloadCultivatorsToExcel(); 
              setReportId(task_id);
            }
          }, 2000);
        }
  
        // Vérifier toutes les 6 secondes
      } catch (error) {
        console.error("Erreur exportation Excel :", error);
      } finally {
        //setLoadingEportBtn(false);
      }
    };
    const DownloadCultivatorsToExcel = async () => {
      try {
        const response = await fetchData("get", "/cafe/achat_cafe/download/", {
          params: { report_id: reportId },
          isBlob: true,
        });
        console.log("downloard", response);
        // Créer le blob avec le bon type MIME
        const blob = new Blob([response.data], {
          type:
            response.headers["content-type"] ||
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
  
        const url = window.URL.createObjectURL(blob);
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
  
        const timestamp = `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;
        // Nom du fichier par défaut
        let filename = `cultivator_list_${timestamp}.xlsx`;
  
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?(.+)"?/);
          if (match && match[1]) filename = match[1];
        }
  
        // Création du <a> temporaire
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
  
        // Nettoyage
        link.remove();
        window.URL.revokeObjectURL(url);
  
        setActivedownloadBtn(false);
      } catch (error) {
        console.error("Erreur lors de l'exportation Excel :", error);
      } finally {
        setLoadingEportBtn(false);
      }
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
            handleFilter={handleFilter}
            hendlesecherchData={hendlesecherchData}
            handlerExportAchat={exportCultivatorsToExcel}
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
