"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartColumn, List } from "lucide-react";
import CultivatorsListTable from "@/app/ui/dashboard/cultivators/list";
import ProfilePage from "@/app/ui/dashboard/cultivators/profile/ProfilePage";
import { fetchData } from "@/app/_utils/api";
import CultivatorAnalytics from "../analytics";
const XLSX = require("xlsx");
import { saveAs } from "file-saver";
function CultivatorData() {
  const [individualData, setIndividualData] = useState([]);
  const [associationData, setAssociationData] = useState([]);
  const [typeExport, setTypeExport] = useState("individuel");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [data_association, setDataAssociation] = useState([]);
  const [cultivateur_type, setCultivateur_type] = useState("individuel");
  const getCultivators = async () => {
    setTypeExport("individuel");
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
      // Format Individual Data
      const data = responseIndividuals.results.map((cultivator) => ({
        id: cultivator.id,
        cultivator: {
          cultivator_code: cultivator?.cultivator_code,
          first_name: cultivator?.cultivator_first_name,
          last_name: cultivator?.cultivator_last_name,
          image_url: cultivator?.cultivator_photo,
          telephone: cultivator?.cultivator_telephone,
          // Association specific fields
          cultivator_assoc_name: cultivator?.cultivator_assoc_name,
          cultivator_assoc_rep_name: cultivator?.cultivator_assoc_rep_name,
          cultivator_assoc_nif: cultivator?.cultivator_assoc_nif,
          cultivator_assoc_rep_phone: cultivator?.cultivator_assoc_rep_phone,
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
      setCultivateur_type("individuel");
      setData(data);
    } catch (error) {
      console.error("Error fetching cultivators data:", error);
    }
  };
  const getCultivatorsAssociation = async () => {
    try {
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

      let data = [];
      // Format Individual Data
      data = responseAssociations.results.map((cultivator) => ({
        id: cultivator.id,
        cultivator: {
          cultivator_code: cultivator?.cultivator_code,
          first_name: cultivator?.cultivator_first_name,
          last_name: cultivator?.cultivator_last_name,
          image_url: cultivator?.cultivator_photo,
          telephone: cultivator?.cultivator_telephone,
          // Association specific fields
          cultivator_assoc_name: cultivator?.cultivator_assoc_name,
          cultivator_assoc_rep_name: cultivator?.cultivator_assoc_rep_name,
          cultivator_assoc_nif: cultivator?.cultivator_assoc_nif,
          cultivator_assoc_rep_phone: cultivator?.cultivator_assoc_rep_phone,
          cultivator_assoc_numero_fiche:
            cultivator?.cultivator_assoc_numero_fiche,
          cultivator_type: "personel",
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

      setDataAssociation(data);
      setTypeExport("association");
    } catch (error) {
      console.error("Error fetching cultivators data:", error);
    }
  };
  useEffect(() => {
    try {
      if (cultivateur_type === "individuel") {
        setTypeExport("individuel");
        getCultivators();
      } else if (cultivateur_type === "association") {
        getCultivatorsAssociation();
      }
    } catch (error) {
      console.error("Error fetching cultivators data:", error);
    }
  }, [cultivateur_type]);

  const exportCultivatorsToExcel = async () => {
    try {
      const initResponse = await fetchData(
        "get",
        `cultivators/get_cafe_cultivators/?cafeiculteur_type=personne`,
        { params: { limit: 1 } }
      );

      const totalCount = initResponse?.count || 0;
      if (totalCount === 0) return;

      const response = await fetchData(
        "get",
        `cultivators/get_cafe_cultivators/?cafeiculteur_type=personne`,
        {
          params: {
            limit: totalCount,
          },
        }
      );

      const allData = response.results || [];
      const uniqueData = Array.from(
        new Map(allData.map((item) => [item.id, item])).values()
      );

      const formattedData = uniqueData.map((item) => {
        const formattedItem = {
          code_cultivateur: item.cultivator_code || "",
          Type: item.cultivator_entity_type || "",
          Nom: item.cultivator_first_name || "",
          Prénom: item.cultivator_last_name || "",
          Genre: item.cultivator_gender || "",
          CNI: item.cultivator_cni || "",
          // association: item.cultivator_assoc_name || "",
          // Représentant_de_lassociation: item.cultivator_assoc_rep_name || "",
          // numero_fiche: item.cultivator_assoc_numero_fiche || "",
          // NIF_de_lassociation: item.cultivator_assoc_nif || "",
          Province:
            item.cultivator_adress?.zone_code?.commune_code?.province_code
              ?.province_name || "",
          Commune:
            item.cultivator_adress?.zone_code?.commune_code?.commune_name || "",
          Zone: item.cultivator_adress?.zone_code?.zone_name || "",
          Colline: item.cultivator_adress?.colline_name || "",
          Societte: item?.collector?.hangar?.hangar_name || "",
          Nombre_de_champs: item.nombre_champs || 0,
          Superficie_totale_des_champs: item.superficie_totale_champs || 0,
          Telephone: item.cultivator_telephone || "",
        };

        // Mode de paiement
        if (
          item?.cultivator_bank_name == "banque" ||
          item?.cultivator_bank_name == "microfinance"
        ) {
          formattedItem.mode_payement =
            item?.cultivator_bank_name.toUpperCase();
          formattedItem.Banque_ou_microfinance = item?.cultivator_bank_name;
          formattedItem.Numero_compte = item?.cultivator_bank_account || "";
        } else if (item?.cultivator_payment_type == "mobile_money") {
          formattedItem.mode_payement = item?.cultivator_payment_type
            .replaceAll("_", " ")
            .toUpperCase();
          // const phone = item.cultivator_mobile_payment.toString();
          // if (phone.startsWith("6") || phone.startsWith("3")) {
          //   formattedItem.nom_service =
          //     item.cultivator_mobile_payment_service || "L";
          // } else if (phone.startsWith("7")) {
          //   formattedItem.nom_service = "ECOCASH";
          // }
          formattedItem.nom_service = item.cultivator_mobile_payment_name || "";
          formattedItem.Numero_de_telephone_de_payement =
            item.cultivator_mobile_payment_account || "";
          formattedItem.proprietaire = item.cultivator_account_owner || "";
          formattedItem.date_enregistrement = item.created_at || "";
        } else {
          formattedItem.mode_payement = "";
        }

        return formattedItem;
      });

      // Génération du fichier Excel
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Cultivateurs");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      saveAs(
        blob,
        `cultivateurs_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Erreur exportation Excel :", error);
    }
  };
  const exportAssociationToExcel = async () => {
    try {
      const initResponse = await fetchData(
        "get",
        `cultivators/get_cafe_cultivators?cafeiculteur_type=association`,
        { params: { limit: 1 } }
      );

      const totalCount = initResponse?.count || 0;
      if (totalCount === 0) return;

      const response = await fetchData(
        "get",
        `cultivators/get_cafe_cultivators?cafeiculteur_type=association`,
        {
          params: {
            limit: totalCount,
          },
        }
      );

      const allData = response.results || [];
      const uniqueData = Array.from(
        new Map(allData.map((item) => [item.id, item])).values()
      );

      const formattedData = uniqueData.map((item) => {
        const formattedItem = {
          code_cultivateur: item.cultivator_code || "",
          Type: item.cultivator_entity_type || "",
          association: item.cultivator_assoc_name || "",
          Représentant_de_lassociation: item.cultivator_assoc_rep_name || "",
          telephone_du_représentant: item.cultivator_assoc_rep_phone || "",
          numero_fiche: item.cultivator_assoc_numero_fiche || "",
          NIF_de_lassociation: item.cultivator_assoc_nif || "",

          Province:
            item.cultivator_adress?.zone_code?.commune_code?.province_code
              ?.province_name || "",
          Commune:
            item.cultivator_adress?.zone_code?.commune_code?.commune_name || "",
          Zone: item.cultivator_adress?.zone_code?.zone_name || "",
          Colline: item.cultivator_adress?.colline_name || "",
          Societte: item?.collector?.hangar?.hangar_name || "",
          Nombre_de_champs: item.nombre_champs || 0,
          Superficie_totale_des_champs: item.superficie_totale_champs || 0,
          // Telephone: item.cultivator_telephone || "",
        };

        // Mode de paiement
        if (
          item?.cultivator_bank_name == "banque" ||
          item?.cultivator_bank_name == "microfinance"
        ) {
          formattedItem.mode_payement =
            item?.cultivator_bank_name.toUpperCase();
          formattedItem.Banque_ou_microfinance = item?.cultivator_bank_name;
          formattedItem.Numero_compte = item?.cultivator_bank_account || "";
        } else if (item?.cultivator_payment_type == "mobile_money") {
          formattedItem.mode_payement = item?.cultivator_payment_type
            .replaceAll("_", " ")
            .toUpperCase();
          // const phone = item.cultivator_mobile_payment.toString();
          // if (phone.startsWith("6") || phone.startsWith("3")) {
          //   formattedItem.nom_service =
          //     item.cultivator_mobile_payment_service || "L";
          // } else if (phone.startsWith("7")) {
          //   formattedItem.nom_service = "ECOCASH";
          // }
          formattedItem.nom_service = item.cultivator_mobile_payment_name || "";
          formattedItem.Numero_de_telephone_de_payement =
            item.cultivator_mobile_payment_account || "";
          formattedItem.proprietaire = item.cultivator_account_owner || "";
          formattedItem.date_enregistrement = item.created_at || "";
        } else {
          formattedItem.mode_payement = "";
        }

        return formattedItem;
      });

      // Génération du fichier Excel
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "associations");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      saveAs(
        blob,
        `associations_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Erreur exportation Excel :", error);
    }
  };

  const onClickTyepeExport = (type) => {
    setCultivateur_type(type);
  };
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
            individualData={data}
            associationData={data_association}
            isCultivatorsPage={true}
            onExportToExcel={exportCultivatorsToExcel}
            onExportAssociationToExcel={exportAssociationToExcel}
            typeExport={typeExport}
            onClickTyepeExport={onClickTyepeExport}
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
