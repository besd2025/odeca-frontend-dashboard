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
import Achats from "./achats/achats";
import TransferCtDep from "./tranfer/transfer-ct";
import { Button } from "@/components/ui/button";

function DetailsContent({ items }) {
  const cultivatorsData = [
    {
      id: "cultivator_001",
      cultivator: {
        cultivator_code: "2530-522-7545",
        first_name: "Brave",
        last_name: "Eddy",
        image_url: "/images/logo_1.jpg",
      },
      ct_ct: "NGome",
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
      ct_ct: "aa",
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
      ct_ct: "NGome",
      society: "ODECA",
      localite: {
        province: "Buja",
        commune: "Ntahangwa",
      },
      champs: 4,
    },
  ];
  const ctAchats = [
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
      from_ct: "Ngome",
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
            data={cultivatorsData}
            isCultivatorsPage={false}
          />
        </TabsContent>
        <TabsContent value="achats">
          <h1 className="text-xl font-semibold m-2">Achats effectues</h1>
          <Achats data={ctAchats} isCultivatorsPage={false} />
        </TabsContent>

        <TabsContent value="maps">En cours...</TabsContent>
        <TabsContent value="transferCt">
          <h1 className="text-xl font-semibold m-2">Transfers effectues</h1>
          <TransferCtDep data={transferData} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default DetailsContent;
