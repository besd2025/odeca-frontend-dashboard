"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft, Building2, Factory } from "lucide-react";
import TransferSdlDep from "@/app/ui/dashboard/stocks/transfers/components/sdl-transfers/transfer-sdl";
import TransferCtDep from "@/app/ui/dashboard/stocks/transfers/components/ct-transfers/transfer-ct";
import { fetchData } from "@/app/_utils/api";

export default function TransfersPage() {
  const [sdlTransfers, setSdlTransfers] = useState([]);
  const [ctTransfers, setCtTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllTransfers = async () => {
      try {
        setLoading(true);
        const response = await fetchData("get", "cafe/transfert_sdl_usine/", {
          body: { limit: 1000, offset: 0 },
        });
        const response_ct_sdl = await fetchData(
          "get",
          "cafe/transfer_ct_sdl/",
          {
            body: { limit: 1000, offset: 0 },
          }
        );
        const results = response?.results || [];
        const results2 = response_ct_sdl.results || [];
        const mappedSdlTransfers = results
          .filter((t) => t.sdl && !t.ct) // Assuming if it has SDL source and no CT source
          .map((transfer) => ({
            id: transfer.id,
            from_sdl: transfer.sdl?.sdl_nom || "Inconnu",
            usine: transfer.usine_deparchage?.usine_name || "Inconnu", // Guessing destination structure
            society: transfer.sdl?.societe?.nom_societe,
            date: transfer?.transfer_date,
            qte_tranferer: {
              ca: transfer?.total_parche,
            },
            photo_fiche: transfer.photo_fiche, // Adjust if needed
            localite: {
              province:
                transfer.sdl?.sdl_adress?.zone_code?.commune_code?.province_code
                  ?.province_name,
              commune:
                transfer.sdl?.sdl_adress?.zone_code?.commune_code?.commune_name,
            },
          }));

        const mappedCtTransfers = results2
          .filter((t) => t.ct) // Assuming presence of CT source
          .map((transfer) => ({
            id: transfer.id,
            from_ct: transfer.ct?.ct_nom || "Inconnu",
            to_depulpeur_name: transfer.sdl?.sdl_nom || "Inconnu",
            society: transfer.sdl?.societe?.nom_societe,
            date: transfer?.transfer_date,
            status: transfer?.est_confirme,
            qte_tranferer: {
              ca: transfer?.quantite_cerise_a,
              cb: transfer.quantite_cerise_b,
            },
            photo_fiche: transfer.photo_bordereau,
            localite: {
              province:
                transfer.sdl?.sdl_adress?.zone_code?.commune_code?.province_code
                  ?.province_name,
              commune:
                transfer.sdl?.sdl_adress?.zone_code?.commune_code?.commune_name,
            },
          }));
        console.log(results2);
        setSdlTransfers(mappedSdlTransfers);
        setCtTransfers(mappedCtTransfers);
      } catch (error) {
        console.error("Error fetching transfers:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllTransfers();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des Transferts</h1>
      </div>

      <Tabs defaultValue="sdl" className="w-full">
        <TabsList className="w-full h-10 lg:w-fit">
          <TabsTrigger value="sdl" className="flex gap-2">
            <Building2 className="w-4 h-4" />
            <span>Transferts SDL</span>
          </TabsTrigger>
          <TabsTrigger value="ct" className="flex gap-2">
            <Factory className="w-4 h-4" />
            <span>Transferts CT</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sdl" className="space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                Transferts depuis les Stations de Lavage
              </h2>
              <p className="text-sm text-muted-foreground">
                Liste des transferts effectués depuis les SDL vers les
                usines/dépulpeurs.
              </p>
            </div>
            <TransferSdlDep data={sdlTransfers} />
          </div>
        </TabsContent>

        <TabsContent value="ct" className="space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                Transferts depuis les Centres de Transit
              </h2>
              <p className="text-sm text-muted-foreground">
                Liste des transferts effectués depuis les CT vers les SDL.
              </p>
            </div>
            <TransferCtDep data={ctTransfers} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
