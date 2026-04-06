"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft, Building2, Factory } from "lucide-react";
import TransferSdlDep from "@/app/ui/dashboard/stocks/transfers/components/sdl-transfers/transfer-sdl";
import TransferCtDep from "@/app/ui/dashboard/stocks/transfers/components/ct-transfers/transfer-ct";
import { fetchData } from "@/app/_utils/api";
import { TableSkeleton } from "@/components/ui/skeletons";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import ComingSoonOverlay from "@/app/ui/components/coming-soon-overlay";
export default function TransfersPage() {
  const [sdlTransfers, setSdlTransfers] = useState([]);
  const [ctTransfers, setCtTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("sdl");

  // Shared Pagination states
  const [limit, setLimit] = useState(10);
  const [pointer, setPointer] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Single useEffect for all data fetching
  useEffect(() => {
    const fetchDataForActiveTab = async () => {
      try {
        if (activeTab === "sdl") {
          const response = await fetchData("get", "cafe/transfert_sdl_usine/", {
            params: { limit: limit, offset: pointer },
          });
          const results = response?.results || [];
          const mappedSdlTransfers = results.map((transfer) => ({
            id: transfer.id,
            from_sdl: transfer.sdl?.sdl_nom || "Inconnu",
            usine: transfer.usine_deparchage?.usine_name || "Inconnu",
            society: transfer.sdl?.societe?.nom_societe,
            date: transfer?.transfer_date,
            qte_tranferer: {
              ca: transfer?.total_parche,
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
          setTotalCount(response?.count || 0);
        } else {
          const response_ct_sdl = await fetchData("get", "cafe/transfer_ct_sdl/", {
            params: { limit: limit, offset: pointer },
          });
          const results2 = response_ct_sdl.results || [];
          const mappedCtTransfers = results2.map((transfer) => ({
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
          setCtTransfers(mappedCtTransfers);
          setTotalCount(response_ct_sdl?.count || 0);
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} transfers:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataForActiveTab();
  }, [activeTab, limit, pointer]);

  const datapagination = {
    totalCount: totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: currentPage,
    pointer: pointer,
    limit: limit,

    onPageChange: (page) => {
      setCurrentPage(page);
      setPointer((page - 1) * limit);
    },
    onLimitChange: (newLimit) => {
      setLimit(newLimit);
      setPointer(0);
      setCurrentPage(1);
    },
  };
  console.log("pagination", datapagination);
  const handleTabChange = (value) => {
    setActiveTab(value);
    setPointer(0);
    setCurrentPage(1);
    setTotalCount(0);
  };

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SOCIETE, ROLES.SUPERVISEUR_REGIONAL, ROLES.SUPERVISEUR]}>
      <div className="p-4 space-y-4 relative">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestion des Transferts</h1>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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

          <TabsContent value="sdl" className="space-y-4 relative">
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
              {loading ? (
                <TableSkeleton rows={5} columns={5} />
              ) : (
                <TransferSdlDep data={sdlTransfers} datapagination={datapagination} />
              )}
            </div>
            <ComingSoonOverlay transparent={true} />
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
              {loading ? (
                <TableSkeleton rows={5} columns={5} />
              ) : (
                <TransferCtDep data={ctTransfers} datapagination={datapagination} />
              )}
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </ProtectedRoute>
  );
}
