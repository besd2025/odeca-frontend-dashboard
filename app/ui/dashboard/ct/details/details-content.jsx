"use client";
import React, { useState, useEffect, use } from "react";
import { Card } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import EditHistory from "./edit-history";
import {
  History,
  MapPinHouse,
  MoreHorizontal,
  ShoppingCart,
  Spline,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CultivatorsListTable from "../../cultivators/list";
import AchatsListTable from "@/app/ui/dashboard/stocks/achats/achats-list-table";
import TransferCtDep from "@/app/ui/dashboard/stocks/transfers/components/ct-transfers/transfer-ct";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/app/_utils/api";
import SharedGeoLocalisation from "@/components/ui/geo-localisation";
const XLSX = require("xlsx");
import { saveAs } from "file-saver";
function DetailsContent({ id }) {
  const [tab, setTab] = useState("cultivators");
  const [data, setData] = React.useState([]);
  const [individualAchatsData, setIndividualAchatsData] = React.useState([]);
  const [associationAchatsData, setAssociationAchatsData] = React.useState([]);
  const [dataTransfert, setDataTransfert] = React.useState([]);
  const [cultivateur_type, setCultivateur_type] = useState(
    "cultivator_individual",
  );
  const [individualCultivatorsData, setIndividualCultivatorsData] = useState(
    [],
  );
  const [associationCultivatorsData, setAssociationCultivatorsData] = useState(
    [],
  );
  const [transfertbtnLoading, setTransfertbtnLoading] = useState(false);
  const getAchatsHangars = async () => {
    try {
      const response = await fetchData(
        "get",
        `cafe/centres_transite/${id}/get_achats/`,
        (params = {
          params: { limit: 1000, offset: 0 },
          additionalHeaders: {},
          body: {},
        }),
      );
      const results = response?.results;
      const formatData = (achats) => ({
        id: achats?.id,
        cultivator: {
          cultivator_code: achats?.cafeiculteur?.cultivator_code,
          first_name: achats?.cafeiculteur?.cultivator_first_name,
          last_name: achats?.cafeiculteur?.cultivator_last_name,
          image_url: achats?.cafeiculteur?.cultivator_photo,
          // Association fields
          cultivator_assoc_name: achats?.cafeiculteur?.cultivator_assoc_name,
          cultivator_assoc_rep_name:
            achats?.cafeiculteur?.cultivator_assoc_rep_name,
        },
        localite: {
          province:
            achats?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code
              ?.province_code?.province_name,
          commune:
            achats?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code
              ?.commune_name,
        },
        num_fiche: 784,
        num_recu: achats?.numero_recu,
        photo_fiche: achats?.photo_fiche,
        ca: achats?.quantite_cerise_a,
        cb: achats?.quantite_cerise_b,
        date: achats?.date_achat,
        isAssociation: !!achats?.cafeiculteur?.cultivator_assoc_name,
      });

      const formattedResults = results?.map(formatData) || [];
      setIndividualAchatsData(formattedResults.filter((a) => a.isAssociation));
      setAssociationAchatsData(formattedResults.filter((a) => a.isAssociation));
    } catch (error) {
      console.error("Error fetching cultivators data:", error);
    }
  };
  const getCultivatorsIndividual = async () => {
    try {
      const response = await fetchData(
        "get",
        `cafe/centres_transite/${id}/get_cultivators/`,
        { params: { limit: 1000, offset: 0 }, additionalHeaders: {}, body: {} },
      );
      const results = response?.results;
      const cultivatorsData = results?.map((cultivator) => ({
        id: cultivator?.id,
        cultivator: {
          cultivator_code: cultivator?.cultivator_code,
          first_name: cultivator?.cultivator_first_name,
          last_name: cultivator?.cultivator_last_name,
          image_url: cultivator?.cultivator_photo,
          telephone: cultivator?.cultivator_telephone,
        },
        sdl_ct: "NGome",
        society: "ODECA",
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
      setIndividualCultivatorsData(cultivatorsData);
    } catch (error) {
      console.error("Error fetching cultivators data:", error);
    }
  };
  const getCultivatorsAssociation = async () => {
    try {
      const response = await fetchData(
        "get",
        `cafe/centres_transite/${id}/get_cultivators_association/`,
        { params: { limit: 1000, offset: 0 }, additionalHeaders: {}, body: {} },
      );
      const results = response?.results;
      const cultivatorsData = results?.map((cultivator) => ({
        id: cultivator?.id,
        cultivator: {
          cultivator_code: cultivator?.cultivator_code,
          first_name: cultivator?.cultivator_first_name,
          last_name: cultivator?.cultivator_last_name,
          image_url: cultivator?.cultivator_photo,
          telephone: cultivator?.cultivator_telephone,
        },
        sdl_ct: "NGome",
        society: "ODECA",
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
      setAssociationCultivatorsData(cultivatorsData);
    } catch (error) {
      console.error("Error fetching cultivators data:", error);
    }
  };
  const getTransfers = async () => {
    try {
      const response = await fetchData(
        "get",
        `cafe/centres_transite/${id}/get_transferts/`,
        { params: { limit: 1000, offset: 0 }, additionalHeaders: {}, body: {} },
      );
      const results = response?.results;
      const transfersData = results?.map((transfer) => ({
        id: transfer?.id,
        from_ct: transfer?.ct?.ct_nom,
        to_depulpeur_name: transfer?.sdl?.sdl_nom,
        society: transfer?.sdl?.societe?.nom_societe,
        qte_tranferer: {
          ca: transfer?.quantite_cerise_a,
          cb: transfer?.quantite_cerise_b,
        },
        photo_fiche: transfer?.photo_bordereau || null,
        localite: {
          province:
            transfer?.sdl?.sdl_adress?.zone_code?.commune_code?.province_code
              ?.province_name,
          commune:
            transfer?.sdl?.sdl_adress?.zone_code?.commune_code?.commune_name,
        },
      }));
      setDataTransfert(transfersData);
    } catch (error) {
      console.error("Error fetching cultivators data:", error);
    }
  };

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setSelectedPosition(place?.coordinates);
  };
  const [typeExport, setTypeExport] = useState("individual");
  useEffect(() => {
    if (achatCultivateur_type === "achat_cultivator_individual") {
      getAchatsHangars();
    } else if (achatCultivateur_type === "achat_cultivator_association") {
      getAchatsHangars();
    }

    try {
      if (cultivateur_type === "cultivator_individual") {
        setTypeExport("individuel");

        getCultivatorsIndividual();
      } else if (cultivateur_type === "cultivator_association") {
        getCultivatorsAssociation();
      }
      console.log(
        "Fetching transfers data due to loading state...",
        transfertbtnLoading,
      );
      if (transfertbtnLoading) {
        getTransfers();
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
        { params: { limit: 1000, offset: 0 }, additionalHeaders: {}, body: {} },
      );

      const totalCount = initResponse?.count || 0;
      if (totalCount === 0) return;

      const response = await fetchData(
        "get",
        `cultivators/get_cafe_cultivators/?cafeiculteur_type=personne`,
        {
          params: {
            params: { limit: 1000, offset: 0 },
            additionalHeaders: {},
            body: {},
          },
        },
      );

      const allData = response.results || [];
      const uniqueData = Array.from(
        new Map(allData.map((item) => [item.id, item])).values(),
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
        `cultivateurs_${new Date().toISOString().split("T")[0]}.xlsx`,
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
        { params: { limit: 1 } },
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
        },
      );

      const allData = response.results || [];
      const uniqueData = Array.from(
        new Map(allData.map((item) => [item.id, item])).values(),
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
        `associations_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
    } catch (error) {
      console.error("Erreur exportation Excel :", error);
    }
  };

  const onClickTyepeExport = (type) => {
    setCultivateur_type(type);
  };
  const handleFilter = (filterData) => {
    // Implement filtering logic here based on filterData
    console.log("Received filter data ffffhhh:", filterData);
    // You can use filterData to fetch filtered cultivators from the API
  };
  const fetchCultivatorsByType = (type) => {
    setCultivateur_type(type);
  };
  const [achatCultivateur_type, setAchatCultivateur_type] = useState(
    "achat_cultivator_individual",
  );

  const fetchAchatCultivatorsByType = (type) => {
    console.log("Fetch achat cultivators of type:", type);
    setAchatCultivateur_type(type);
  };

  const fethTransfertbtnLoading = (loading) => {
    setTransfertbtnLoading(loading);
  };
  return (
    <Card className="p-2 space-y-4 rounded-xl shadow-sm">
      <Tabs value={tab} className="space-y-6 w-full" onValueChange={setTab}>
        <TabsList className="overflow-x-auto w-full ">
          <TabsTrigger value="cultivators" className="shrink-0">
            <Users /> Cafeiculteurs
          </TabsTrigger>
          <TabsTrigger value="achats" className="shrink-0">
            <ShoppingCart /> Achats effectues
          </TabsTrigger>
          <TabsTrigger value="transferCt" className="hidden lg:flex shrink-0">
            <Spline /> Transfer(CT vers SDL)
          </TabsTrigger>
          <TabsTrigger value="maps" className="hidden lg:flex shrink-0">
            <MapPinHouse /> Map
          </TabsTrigger>
          {/* <TabsTrigger value="edits">
            <History /> Historique des modifications
          </TabsTrigger> */}

          {/* MOBILE DROPDOWN */}
          <div className="block lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => setTab("transferCt")}>
                  <Spline className="w-4 h-4" /> Transfer(CT vers SDL)
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setTab("maps")}>
                  <MapPinHouse className="w-4 h-4" /> Map
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TabsList>
        <TabsContent value="cultivators">
          <h1 className="text-xl font-semibold m-2">Liste des Cafeiculteurs</h1>
          <CultivatorsListTable
            individualData={individualCultivatorsData}
            associationData={associationCultivatorsData}
            data={data}
            isCultivatorsPage={false}
            onExportToExcel={exportCultivatorsToExcel}
            onExportAssociationToExcel={exportAssociationToExcel}
            typeExport={typeExport}
            onClickTyepeExport={onClickTyepeExport}
            handleFilter={handleFilter}
            fetchCultivatorsByType={fetchCultivatorsByType}
          />
        </TabsContent>
        <TabsContent value="achats">
          <h1 className="text-xl font-semibold m-2">Achats effectues</h1>
          <AchatsListTable
            individualData={individualAchatsData}
            associationData={associationAchatsData}
            isCultivatorsPage={false}
            fetchCultivatorsByType={fetchAchatCultivatorsByType}
          />
        </TabsContent>

        <TabsContent value="maps">
          <SharedGeoLocalisation
            selectedPlace={selectedPlace}
            onSelectPlace={handleSelectPlace}
            onCloseDetails={() => setSelectedPlace(null)}
            flyToPosition={selectedPosition}
            mainMap={false}
            data={[
              {
                name: "CT",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-10 text-secondary drop-shadow-xl"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                mapIcon: (
                  <div className="relative size-16 flex items-center justify-center">
                    {/* PIN */}
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="absolute inset-0 size-full text-secondary/50 drop-shadow-xl z-0"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    </svg>
                    {/* ICON CENTER */}
                    <div className="absolute -top-2 inset-0 flex items-center justify-center z-999">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6 text-white drop-shadow-md"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ),
                places: [
                  {
                    name: "CT KAREHE",
                    coordinates: [-3.3896077, 29.9255809],
                    type: "CT",
                    address: "Zone Karehe, Commune Buyenzi",
                    stockCA: 12500,
                    stockCB: 4500,
                    farmersCount: 342,
                  },
                  {
                    name: "CT KIGUSU",
                    coordinates: [-3.3896077, 29.9255809],
                    type: "CT",
                    address: "Zone Kigusu, Commune Buyenzi",
                    stockCA: 8900,
                    stockCB: 2100,
                    farmersCount: 156,
                  },
                ],
              },
            ]}
          />
        </TabsContent>
        <TabsContent value="transferCt">
          <h1 className="text-xl font-semibold m-2">Transfers effectues</h1>
          <TransferCtDep
            data={dataTransfert}
            fethTransfertbtnLoading={fethTransfertbtnLoading}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default DetailsContent;
