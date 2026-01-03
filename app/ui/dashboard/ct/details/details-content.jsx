"use client";
import React, { useState } from "react";
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
function DetailsContent({ id }) {
  const [tab, setTab] = useState("cultivators");
  const [data, setData] = React.useState([]);
  const [individualAchatsData, setIndividualAchatsData] = React.useState([]);
  const [associationAchatsData, setAssociationAchatsData] = React.useState([]);
  const [dataTransfert, setDataTransfert] = React.useState([]);
  React.useEffect(() => {
    const getAchatsHangars = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/hangars/${id}/get_achats/`,
          {}
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
          formattedResults.filter((a) => !a.isAssociation)
        );
        setAssociationAchatsData(
          formattedResults.filter((a) => a.isAssociation)
        );
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };
    const getCultivators = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/centres_transite/${id}/get_cultivators/`,
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
          `cafe/centres_transite/${id}/get_transferts/`,
          {}
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
          photo_fiche: "/images/logo_1.jpg",
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
    getTransfers();
    getAchatsHangars();
    getCultivators();
  }, [id]);

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
          <CultivatorsListTable data={data} isCultivatorsPage={false} />
        </TabsContent>
        <TabsContent value="achats">
          <h1 className="text-xl font-semibold m-2">Achats effectues</h1>
          <AchatsListTable
            individualData={individualAchatsData}
            associationData={associationAchatsData}
            isCultivatorsPage={false}
          />
        </TabsContent>

        <TabsContent value="maps">En cours...</TabsContent>
        <TabsContent value="transferCt">
          <h1 className="text-xl font-semibold m-2">Transfers effectues</h1>
          <TransferCtDep data={dataTransfert} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default DetailsContent;
