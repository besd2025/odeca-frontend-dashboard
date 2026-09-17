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
import AchatsListTable from "@/app/ui/dashboard/stocks/achats/achats-list-table";
import TransferCtDep from "@/app/ui/dashboard/stocks/transfers/components/ct-transfers/transfer-ct";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/app/_utils/api";
import SharedGeoLocalisation from "@/components/ui/geo-localisation";
const XLSX = require("xlsx");
import { saveAs } from "file-saver";
import ComingSoonOverlay from "@/app/ui/components/coming-soon-overlay";
import Transfers from "./transfers";
import AchatsWashedListTable from "./achats/achats-list";
function DetailsContent({ id, slug }) {
  const [tab, setTab] = useState("achats");
  const [data, setData] = React.useState([]);
  const [individualAchatsData, setIndividualAchatsData] = React.useState([]);
  const [associationAchatsData, setAssociationAchatsData] = React.useState([]);
  const [dataTransfert, setDataTransfert] = React.useState([]);

  // Transfert Pagination State
  const [pointerTransfer, setPointerTransfer] = useState(0);
  const [limitTransfer, setLimitTransfer] = useState(5);
  const [totalCountTransfer, setTotalCountTransfer] = useState(0);
  const [currentPageTransfer, setCurrentPageTransfer] = useState(1);
  const [cultivateur_type, setCultivateur_type] = useState(
    "cultivator_individual",
  );
  const [achatCultivateur_type, setAchatCultivateur_type] = useState(
    "achat_cultivator_individual",
  );
  const [individualCultivatorsData, setIndividualCultivatorsData] = useState(
    [],
  );
  const [associationCultivatorsData, setAssociationCultivatorsData] = useState(
    [],
  );
  const [transfertbtnLoading, setTransfertbtnLoading] = useState(false);
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCountAchat, setTotalCountAchat] = useState(0);

  const [pointerAchat, setPointerAchat] = useState(0);
  const [limitAchat, setLimitAchat] = useState(5);
  const [currentPageAchat, setCurrentPageAchat] = useState(1);
  const [filterAchatData, setFilterAchatData] = useState({});


  const getAchatsHangars = async () => {

    try {
      const response = await fetchData(
        "get",
        `cafe/stationslavage/get_hangar_list_achat_for_washed/`,
        {
          params: {
            ...filterAchatData,
            limit: limitAchat,
            offset: pointerAchat,
            hangar_code: slug,
          },
        },
      );
      const mappedData =
        response?.results?.map((achats) => ({
          id: achats?.id,
          societe: achats?.responsable?.sdl_ct?.sdl?.societe?.nom_societe,
          hangar: achats?.responsable?.sdl_ct?.sdl?.sdl_nom,
          quantite: achats?.quantite,
          qualite: achats?.qualite,
          date: achats?.date_achat,

        })) || [];

      setTotalCountAchat(response?.count || 0);
      setIndividualAchatsData(mappedData);
    } catch (error) {
      console.error("Error fetching achats data:", error);
    }
  };

  useEffect(() => {
    if (tab == "achats") {
      getAchatsHangars();
    }
  }, [limitAchat, pointerAchat, tab, filterAchatData]);

  const getTransfers = async () => {
    try {
      const response = await fetchData(
        "get",
        `cafe/stationslavage/get_hangar_list_transfert_for_washed/`,
        {
          params: { hangar_code: slug, limit: limitTransfer, offset: pointerTransfer },
          additionalHeaders: {},
          body: {},
        },
      );
      setTotalCountTransfer(response?.count || 0);
      const results = response?.results;
      const transfersData = results?.map((transfer) => ({
        id: transfer?.id,
        from_ct: transfer?.ct?.ct_nom,
        to_depulpeur_name: transfer?.sdl?.sdl_nom,
        society: transfer?.sdl?.societe?.nom_societe,
        date_transfert: transfer?.transfer_date,
        usine: transfer?.usine_deparchage?.usine_name,
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

  useEffect(() => {
    try {

      if (transfertbtnLoading) {
        getTransfers();
      }
    } catch (error) {
      console.error("Error fetching cultivators data:", error);
    }
  }, [

    limit,
    pointer,
    limitTransfer,
    pointerTransfer,
    transfertbtnLoading,
  ]);

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

  const totalPagesAchat = Math.ceil(totalCountAchat / limitAchat);
  const onPageChangeAchat = (pageNumber) => {
    setCurrentPageAchat(pageNumber);
    setPointerAchat((pageNumber - 1) * limitAchat);
  };
  const onLimitChangeAchat = (newLimit) => {
    setLimitAchat(newLimit);
    //localStorage.setItem("table_limit", String(newLimit));
    setPointerAchat(0);
    setCurrentPageAchat(1);
  };
  const totalPagesTransfer = Math.ceil(totalCountTransfer / limitTransfer);
  const onPageChangeTransfer = (pageNumber) => {
    setCurrentPageTransfer(pageNumber);
    setPointerTransfer((pageNumber - 1) * limitTransfer);
  };
  const onLimitChangeTransfer = (newLimit) => {
    setLimitTransfer(newLimit);
    setPointerTransfer(0);
    setCurrentPageTransfer(1);
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

  const dataTransferPagination = {
    totalCount: totalCountTransfer,
    currentPage: currentPageTransfer,
    onPageChange: onPageChangeTransfer,
    totalPages: totalPagesTransfer,
    pointer: pointerTransfer,
    onLimitChange: onLimitChangeTransfer,
    limit: limitTransfer,
  };

  const dataAchatpagination = {
    totalCount: totalCountAchat,
    currentPage: currentPageAchat,
    onPageChange: onPageChangeAchat,
    totalPages: totalPagesAchat,
    pointer: pointerAchat,
    onLimitChange: onLimitChangeAchat,
    limit: limitAchat,
  };


  const onClickTyepeExport = (type) => {
    setCultivateur_type(type);
  };
  const handleFilter = (filterData) => {
    console.log("Received filter data ffffhhh:", filterData);
  };

  // ── Helper Excel ────────────────────────────────────────────
  const buildXlsx = (rows, sheetName, filename) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      filename,
    );
  };

  // ── Exports achats CT filtrés ───────────────────────────────────
  const exportIndividualAchatsToExcel = async () => {
    try {
      const init = await fetchData("get", `cafe/centres_transite/${id}/get_achats/`, { params: { limit: 1, cafeiculteur_type: "personne" } });
      const total = init?.count || 0;
      if (total === 0) return;
      const res = await fetchData("get", `cafe/centres_transite/${id}/get_achats/`, { params: { limit: total, offset: 0, cafeiculteur_type: "personne" } });
      const rows = (res?.results || []).map((a) => ({
        Code_cultivateur: a?.cafeiculteur?.cultivator_code || "",
        Nom: a?.cafeiculteur?.cultivator_last_name || "",
        Prénom: a?.cafeiculteur?.cultivator_first_name || "",
        Num_recu: a?.numero_recu || "",
        CA: a?.quantite_cerise_a || 0,
        CB: a?.quantite_cerise_b || 0,
        Date: a?.date_achat || "",
        Province: a?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code?.province_code?.province_name || "",
        Commune: a?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code?.commune_name || "",
      }));
      buildXlsx(rows, "Achats", `achats_ind_ct_${id}_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (e) { console.error("Export achats CT individuel erreur:", e); }
  };

  const exportAssociationAchatsToExcel = async () => {
    try {
      const init = await fetchData("get", `cafe/centres_transite/${id}/get_achats/`, { params: { limit: 1, cafeiculteur_type: "association" } });
      const total = init?.count || 0;
      if (total === 0) return;
      const res = await fetchData("get", `cafe/centres_transite/${id}/get_achats/`, { params: { limit: total, offset: 0, cafeiculteur_type: "association" } });
      const rows = (res?.results || []).map((a) => ({
        Code_cultivateur: a?.cafeiculteur?.cultivator_code || "",
        Association: a?.cafeiculteur?.cultivator_assoc_name || "",
        Représentant: a?.cafeiculteur?.cultivator_assoc_rep_name || "",
        Num_recu: a?.numero_recu || "",
        CA: a?.quantite_cerise_a || 0,
        CB: a?.quantite_cerise_b || 0,
        Date: a?.date_achat || "",
        Province: a?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code?.province_code?.province_name || "",
        Commune: a?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code?.commune_name || "",
      }));
      buildXlsx(rows, "Achats", `achats_assoc_ct_${id}_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (e) { console.error("Export achats CT association erreur:", e); }
  };
  const fetchCultivatorsByType = (type) => {
    setCultivateur_type(type);
    setPointer(0);
    setCurrentPage(1);
    setTotalCount(0); // Reset count to avoid stale data
    // Clear data to indicate loading/change
    if (type === "cultivator_individual") {
      setAssociationCultivatorsData([]);
    } else {
      setIndividualCultivatorsData([]);
    }
  };

  const fetchAchatCultivatorsByType = (type) => {
    setAchatCultivateur_type(type);
    setCurrentPageAchat(1);
    setPointerAchat(0);
    setTotalCountAchat(0);
    // Clear data
    if (type === "achat_cultivator_individual") {
      setAssociationAchatsData([]);
    } else {
      setIndividualAchatsData([]);
    }
  };

  const fethTransfertbtnLoading = (loading) => {
    setTransfertbtnLoading(loading);
  };
  // useEffect(() => {
  //   // Réinitialiser la pagination lorsque le type de cultivateur change
  //   setCurrentPage(1);
  //   setPointer(0);
  // }, [cultivateur_type]);

  const handleTabChange = (tab) => {
    setTab(tab);
    if (tab === "cultivators") {
      fetchCultivatorsByType(cultivateur_type);
    } else if (tab === "achats") {
      fetchAchatCultivatorsByType(achatCultivateur_type);
    } else if (tab === "transferCt") {
      fethTransfertbtnLoading(true);
    } else if (tab === "maps") {
      //fetchMapData();
    }
  };
  const handleAchatFilter = (filterData) => {
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

    setFilterAchatData(formattedFilterData);
  };
  return (
    <Card className="p-2 space-y-4 rounded-xl shadow-sm">
      <Tabs
        value={tab}
        className="space-y-6 w-full"
        onValueChange={(value) => handleTabChange(value)}
      >
        <TabsList className="overflow-x-auto w-full ">

          <TabsTrigger value="achats" className="shrink-0">
            <ShoppingCart /> Achats effectues
          </TabsTrigger>
          <TabsTrigger value="transferCt" className="hidden lg:flex shrink-0">
            <Spline /> Transfer(CT vers SDL)
          </TabsTrigger>
          <TabsTrigger value="maps" className="hidden lg:flex shrink-0">
            <MapPinHouse /> Map
          </TabsTrigger>

        </TabsList>
        <TabsContent value="achats">
          <h1 className="text-xl font-semibold m-2">Achats effectues</h1>
          <AchatsWashedListTable data={individualAchatsData} />
        </TabsContent>
        <TabsContent value="transferCt">
          <h1 className="text-xl font-semibold m-2">Transfers effectues</h1>
          <Transfers data={dataTransfert} />
        </TabsContent>
        <TabsContent value="maps">
          <div className="w-full h-full relative overflow-hidden">
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
            <ComingSoonOverlay transparent={true} />
          </div>
        </TabsContent>

      </Tabs>
    </Card>
  );
}

export default DetailsContent;
