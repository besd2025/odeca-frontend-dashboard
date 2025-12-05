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
  History,
  MapPinHouse,
  MoreHorizontal,
  ScrollText,
  ShoppingCart,
  Spline,
  Users,
} from "lucide-react";
import CultivatorsListTable from "../../cultivators/list";
import Achats from "./achats/achats";
import TransferSdlDep from "./tranfer/transfer-sdl";
import ReceiptSdlCt from "./receipt/receipt-sdl";
import RedementC from "./rendement";
import RHlist from "./RH";
import { Button } from "@/components/ui/button";

function DetailsContent({ id }) {
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
  const sdlAchats = [
    {
      id: "cultivator_001",
      cultivator: {
        cultivator_code: "2530-522-7545",
        first_name: "Brave",
        last_name: "Eddy",
        image_url: "/images/logo_1.jpg",
      },
      localite: {
        province: "Buja",
        commune: "Ntahangwa",
      },
      num_fiche: 784,
      num_recu: 7894,
      photo_fiche: "/images/logo_1.jpg",
      ca: 78,
      cb: 456,
      date: "12/7/2025",
    },
    {
      id: "cultivator_001",
      cultivator: {
        cultivator_code: "2530-522-7545",
        first_name: "Brave",
        last_name: "Eddy",
        image_url: "/images/logo_1.jpg",
      },
      localite: {
        province: "Buja",
        commune: "Ntahangwa",
      },
      num_fiche: 784,
      num_recu: 7894,
      photo_fiche: "/images/logo_1.jpg",
      ca: 33,
      cb: 4,
      date: "12/7/2025",
    },
    {
      id: "cultivator_001",
      cultivator: {
        cultivator_code: "2530-522-7545",
        first_name: "Brave",
        last_name: "Eddy",
        image_url: "/images/logo_1.jpg",
      },
      localite: {
        province: "Buja",
        commune: "Ntahangwa",
      },
      num_fiche: 784,
      num_recu: 7894,
      photo_fiche: "/images/logo_1.jpg",
      ca: 10,
      cb: 0,
      date: "12/7/2025",
    },
  ];
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
  const RHData = [
    {
      id: "cultivator_001",
      cultivator: {
        cultivator_code: "2530-522-7545",
        first_name: "Brave",
        last_name: "Eddy",
        image_url: "/images/logo_1.jpg",
      },
      cni: "74/565",
      ca: 78,
      ca_price: 7855,
      cb: 785,
      cb_price: 4544,
      qte_total: 555,
      total_price: 457,
    },
  ];
  const [tab, setTab] = useState("cultivators");

  const [data, setData] = React.useState([]);
  const [dataAchat, setAchatDate] = React.useState([]);
  React.useEffect(() => {
    const getAchatsSDls = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_achats/`,
          {}
        );
        const results = response?.results;
        const AchatsSDLData = results?.map((achats) => ({
          id: achats?.id,
          cultivator: {
            cultivator_code: achats?.cafeiculteur?.cultivator_code,
            first_name: achats?.cafeiculteur?.cultivator_first_name,
            last_name: achats?.cafeiculteur?.cultivator_last_name,
            image_url: achats?.cafeiculteur?.cultivator_photo,
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
        }));
        setAchatDate(AchatsSDLData);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };
    const getCultivators = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_cultivators/`,
          {}
        );
        const results = response?.results;
        const cultivatorsData = results?.map((cultivator) => ({
          id: cultivator?.id,
          cultivator: {
            cultivator_code: cultivator?.cultivator_code,
            first_name: cultivator?.cultivator_first_name,
            last_name: cultivator?.cultivator_last_name,
            image_url: cultivator?.cultivator_photo,
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
          champs: 4,
        }));
        setData(cultivatorsData);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };
    const getTransfers = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_transferts/`,
          {}
        );
        const results = response?.results;
        console.log("transfert: ", response);
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
  }, [id]);

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
            <Spline className="w-4 h-4" /> Transfer(SDL → Depulpage)
          </TabsTrigger>

          <TabsTrigger value="receptionSdl" className="hidden lg:flex shrink-0">
            <Spline className="w-4 h-4" /> Reception(CT)
          </TabsTrigger>

          <TabsTrigger value="rendement" className="hidden lg:flex shrink-0">
            <ChartNoAxesCombined className="w-4 h-4" /> Rendement
          </TabsTrigger>

          <TabsTrigger value="rh" className="hidden lg:flex shrink-0">
            <ScrollText className="w-4 h-4" /> RH
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
          <CultivatorsListTable data={data} isCultivatorsPage={false} />
        </TabsContent>
        <TabsContent value="achats">
          <h1 className="text-xl font-semibold m-2">Achats effectues</h1>
          <Achats data={dataAchat} />
        </TabsContent>

        <TabsContent value="maps">En cours...</TabsContent>
        <TabsContent value="transferSdl">
          <h1 className="text-xl font-semibold m-2">Transfers effectues</h1>
          <TransferSdlDep data={transferData} />
        </TabsContent>
        <TabsContent value="receptionSdl">
          <h1 className="text-xl font-semibold m-2">Receptions</h1>
          <ReceiptSdlCt data={transferData} />
        </TabsContent>
        <TabsContent value="rendement">
          <h1 className="text-xl font-semibold m-2">Rendements Cerise</h1>
          <RedementC />
        </TabsContent>
        <TabsContent value="rh">
          <h1 className="text-xl font-semibold m-2">Rapport H</h1>
          <RHlist data={RHData} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default DetailsContent;
