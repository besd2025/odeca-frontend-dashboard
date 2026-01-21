"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchData } from "@/app/_utils/api";
import EditHistory from "./edit-history";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChartNoAxesCombined,
  FileSpreadsheet,
  History,
  MapPinHouse,
  MoreHorizontal,
  ScrollText,
  ShoppingCart,
  Spline,
  Users,
} from "lucide-react";
import CultivatorsListTable from "../../cultivators/list";
import AchatsListTable from "@/app/ui/dashboard/stocks/achats/achats-list-table";
import ReceiptSdlCt from "./receipt/receipt-sdl";
import RedementC from "./rendement";
import RHlist from "./rapports/RH";
import { Button } from "@/components/ui/button";
import TransferSdlDep from "@/app/ui/dashboard/stocks/transfers/components/sdl-transfers/transfer-sdl";
import SharedGeoLocalisation from "@/components/ui/geo-localisation";
import Rapports from "./rapports";

function DetailsContent({ id }) {
  const transferData = [
    {
      id: "cultivator_001",
      from_sdl: "Ngome",
      to_depulpeur_name: "NGANE",
      society: "ODECA",
      qte_tranferer: {
        ca: 78452,
        cb: 741,
      },
      photo_fiche: "/images/logo_1.jpg",
      localite: {
        province: "Buja",
        commune: "Ntahangwa",
      },
    },
  ];

  const [tab, setTab] = useState("cultivators");

  const [data, setData] = React.useState([]);
  const [individualAchatsData, setIndividualAchatsData] = React.useState([]);
  const [associationAchatsData, setAssociationAchatsData] = React.useState([]);
  const [individualCultivatorsData, setIndividualCultivatorsData] =
    React.useState([]);
  const [associationCultivatorsData, setAssociationCultivatorsData] =
    React.useState([]);
  React.useEffect(() => {
    const getAchatsSDls = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_achats/`,
          {},
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
        setIndividualAchatsData(
          formattedResults.filter((a) => !a.isAssociation),
        );
        setAssociationAchatsData(
          formattedResults.filter((a) => a.isAssociation),
        );
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };
    const getCultivators = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_cultivators/`,
          {},
        );
        const results = response?.results;
        const cultivatorsData = results?.map((cultivator) => ({
          id: cultivator?.id,
          cultivator: {
            cultivator_code: cultivator?.cultivator_code,
            first_name: cultivator?.cultivator_first_name,
            last_name: cultivator?.cultivator_last_name,
            image_url: cultivator?.cultivator_photo,
            cultivator_assoc_rep_phone: cultivator?.cultivator_assoc_rep_phone,
            cultivator_assoc_numero_fiche:
              cultivator?.cultivator_assoc_numero_fiche,
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
    const getCultivatorsAssociations = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_cultivators_association/`,
          {},
        );
        const results = response?.results;
        const cultivatorsData = results?.map((cultivator) => ({
          id: cultivator?.id,
          cultivator: {
            cultivator_code: cultivator?.cultivator_code,
            first_name: cultivator?.cultivator_assoc_name,
            last_name: cultivator?.cultivator_last_name,
            image_url: cultivator?.cultivator_photo,
            cultivator_assoc_rep_phone: cultivator?.cultivator_assoc_rep_phone,
            cultivator_assoc_numero_fiche:
              cultivator?.cultivator_assoc_numero_fiche,
          },
          sdl_ct: "NGome",
          society: "fffffff",
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
          `cafe/stationslavage/${id}/get_transferts/`,
          {},
        );
        const results = response?.results;
        const transfersData = results?.map((transfer) => ({
          id: transfer?.id,

          from_sdl: "Ngome",
          to_depulpeur_name: "NGANE",
          society: "ODECA",
          qte_tranferer: {
            ca: 78452,
            cb: 741,
          },
          photo_fiche: "/images/logo_1.jpg",
          localite: {
            province: "Buja",
            commune: "Ntahangwa",
          },
        }));
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };

    getAchatsSDls();
    getCultivators();
    getTransfers();
    getCultivatorsAssociations();
  }, [id]);

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setSelectedPosition(place?.coordinates);
  };
  const handleFilter = (filterData) => {
    // Implement filtering logic here based on filterData
    console.log("Received filter data ffffhhh:", filterData);
    // You can use filterData to fetch filtered cultivators from the API
  };
  return (
    <Card className="p-2 space-y-4 rounded-xl shadow-sm">
      <Tabs value={tab} className="space-y-6 w-full" onValueChange={setTab}>
        {/* TABS LIST */}
        <TabsList className="overflow-x-auto flex-nowrap gap-2 w-full">
          <TabsTrigger value="cultivators" className="shrink-0">
            <Users className="w-4 h-4" /> Cafeiculteurs
          </TabsTrigger>

          <TabsTrigger value="achats" className="shrink-0">
            <ShoppingCart className="w-4 h-4" /> Achats effectues
          </TabsTrigger>

          {/* Hidden on Mobile */}
          <TabsTrigger value="transferSdl" className="hidden lg:flex shrink-0">
            <Spline className="w-4 h-4" /> Transfer(SDL → Deparchage)
          </TabsTrigger>

          <TabsTrigger value="receptionSdl" className="hidden lg:flex shrink-0">
            <Spline className="w-4 h-4" /> Reception(CT)
          </TabsTrigger>

          <TabsTrigger value="rh" className="hidden lg:flex shrink-0">
            <ScrollText className="w-4 h-4" /> Rapports
          </TabsTrigger>

          <TabsTrigger value="maps" className="hidden lg:flex shrink-0">
            <MapPinHouse className="w-4 h-4" /> Map
          </TabsTrigger>

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

                <DropdownMenuItem onClick={() => setTab("transferSdl")}>
                  <Spline className="w-4 h-4" /> Transfer(SDL → Depulpage)
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTab("receptionSdl")}>
                  <Spline className="w-4 h-4" /> Reception(CT)
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setTab("rendement")}>
                  <ChartNoAxesCombined className="w-4 h-4" /> Rendement
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTab("rh")}>
                  <ScrollText className="w-4 h-4" /> RH
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
            isCultivatorsPage={false}
            handleFilter={handleFilter}
          />
        </TabsContent>
        <TabsContent value="achats">
          <h1 className="text-xl font-semibold m-2">Achats effectues</h1>
          <AchatsListTable
            individualData={individualAchatsData}
            associationData={associationAchatsData}
            isCultivatorsPage={false}
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
                name: "SDL",
                coordinates: [-3.3896077, 29.9755819],
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-10 text-red-500 drop-shadow-xl"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
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
                      className="absolute inset-0 size-full text-red-500/50 drop-shadow-xl z-0"
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
                          d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ),
                places: [
                  {
                    name: "SDL GATABO",
                    coordinates: [-3.3896077, 29.9755819],
                    type: "SDL",
                    address: "Zone Gatabo, Commune Kayanza",
                    stockCA: 5600,
                    stockCB: 1200,
                    farmersCount: 89,
                  },
                  {
                    name: "SDL KIGENGE",
                    coordinates: [-3.3896077, 29.9755819],
                    type: "SDL",
                    address: "Zone Kigenge, Commune Ngozi",
                    stockCA: 7800,
                    stockCB: 2300,
                    farmersCount: 112,
                  },
                ],
              },
            ]}
          />
        </TabsContent>
        <TabsContent value="transferSdl">
          <TransferSdlDep data={transferData} />
        </TabsContent>
        <TabsContent value="receptionSdl">
          <ReceiptSdlCt data={transferData} />
        </TabsContent>

        <TabsContent value="rh">
          <h1 className="text-xl font-semibold m-2">
            Selectionner les Rapports
          </h1>
          <Rapports />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default DetailsContent;
