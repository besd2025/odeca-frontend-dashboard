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
        // Assuming global endpoints or filtering a main transfers endpoint
        // Using distinct endpoints is a safer guess given the API structure seen elsewhere
        // If these endpoints don't exist, they should be updated to matches the backend routes.

        // Fetch SDL Transfers
        // Try to fetch all SDL transfers. Assuming 'cafe/transferts/' might return all or separate endpoints exist.
        // Given 'cafe/stationslavage/' lists SDLs, maybe 'cafe/transferts/' lists all.
        // Let's try fetching 'cafe/transferts/' and filtering, or separate calls if documented.
        // Since I don't have docs, I'll attempt a generic 'cafe/transferts/' and check structure,
        // or attempt likely specific endpoints.
        // Let's assume there is a general endpoint for now.
        const response = await fetchData("get", "cafe/transferts/", {});
        const results = response?.results || [];

        // Filter or Map data based on type if the API returns mixed data
        // For now, I'll assume the API returns a list and we might need to separate them if they are mixed
        // or if we use different endpoints.
        // Let's assume "cafe/transferts/" returns mixed and we filter by source type or presence of keys.

        // Mocking/Mapping logic based on previous file's structure:
        // SDL Transfers usually have 'from_sdl' (mapped from API response?)
        // The previous code mapped:
        // from_sdl: "Ngome" (hardcoded/dynamic?), to_depulpeur_name: "NGANE", etc.

        // Let's implement a mapper that tries to handle the data assuming standard fields

        const mappedSdlTransfers = results
          .filter((t) => t.sdl && !t.ct) // Assuming if it has SDL source and no CT source
          .map((transfer) => ({
            id: transfer.id,
            from_sdl: transfer.sdl?.sdl_nom || "Inconnu",
            to_depulpeur_name: transfer.usinage?.usine_nom || "Inconnu", // Guessing destination structure
            society: transfer.sdl?.societe?.nom_societe,
            qte_tranferer: {
              ca: transfer.quantite_cerise_a,
              cb: transfer.quantite_cerise_b,
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

        const mappedCtTransfers = results
          .filter((t) => t.ct) // Assuming presence of CT source
          .map((transfer) => ({
            id: transfer.id,
            from_ct: transfer.ct?.ct_nom || "Inconnu",
            to_depulpeur_name: transfer.sdl?.sdl_nom || "Inconnu", // CT usually goes to SDL? Or Usine?
            // In details-content.jsx for CT, it went to SDL (to_depulpeur_name mapped from sdl.sdl_nom)
            society: transfer.sdl?.societe?.nom_societe,
            qte_tranferer: {
              ca: transfer.quantite_cerise_a,
              cb: transfer.quantite_cerise_b,
            },
            photo_fiche: transfer.photo_fiche,
            localite: {
              province:
                transfer.sdl?.sdl_adress?.zone_code?.commune_code?.province_code
                  ?.province_name,
              commune:
                transfer.sdl?.sdl_adress?.zone_code?.commune_code?.commune_name,
            },
          }));

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
