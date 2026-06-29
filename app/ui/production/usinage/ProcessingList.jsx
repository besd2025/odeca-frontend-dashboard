import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Eye, FileText, CheckCircle2, AlertCircle, Layers, ClipboardList, PackageCheck, List, Settings } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputForm from "./InputForm";
import { fetchData } from "@/app/_utils/api";

export default function ProcessingList({ lots, onFinalize, onViewDetails, onIdChange }) {
  const [activeTab, setActiveTab] = React.useState("Reception");

  const filteredLots = lots.filter((lot) => {
    if (activeTab === "all") return true;
    return lot.status.toLowerCase() === activeTab.toLowerCase();
  });
  const [pointer, setPointer] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [receptionsEnAttenteList, setReceptionsEnAttenteList] = React.useState([]);
  const [receptionsConfirmeList, setReceptionsConfirmeList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [totalCount, setTotalCount] = React.useState(0);
  const [receptionsAllList, setReceptionsAllList] = React.useState([]);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPointer((pageNumber - 1) * limit);
  };

  const onLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPointer(0);
    setCurrentPage(1);
  };

  const handleTabChange = (val) => {
    setActiveTab(val);
    setPointer(0);
    setCurrentPage(1);
  };

  const loadDataForTab = async (tab) => {
    setLoading(true);
    try {
      if (tab === "Reception") {
        const pendingRes = await fetchData("get", `cafe/transfert_sdl_usine_detail_comfimation/get_transfert_comfirmed_par_societe/`, { params: { etat_selection: "PRET_USINE", limit, offset: pointer } });
        const pendingMapped = pendingRes?.results?.map((item) => ({
          id: item?.id,
          code_societe: item?.code_societe || "",
          societe: item?.nom_societe || "",
          //sdls: item?.transfert_details_comfirmation?.transfert_details_comfirmation?.transfer?.sdl?.sdl_nom || [],
          sdls: item?.transfert_details_comfirmation || [],
          dateTransfert: item?.transfer_date || "-",
          dateReception: "-",
          usinageQuantitiesTotal: item?.total_quantite_confirme || 0,
          status: item?.pret_usine || "",
        })) || [];
        console.log(pendingRes)

        setReceptionsAllList(pendingMapped);

        setTotalCount((pendingRes?.count || 0));
      } else if (tab === "En cours") {
        const pendingRes = await fetchData("get", `cafe/transfert_sdl_usine_detail_comfimation/get_transfert_comfirmed_par_societe/`, { params: { etat_selection: "EN_COURS", limit, offset: pointer } });
        const pendingMapped = pendingRes?.results?.map((item) => ({
          id: item?.id,
          code_societe: item?.code_societe || "",
          societe: item?.nom_societe || "",
          //sdls: item?.transfert_details_comfirmation?.transfert_details_comfirmation?.transfer?.sdl?.sdl_nom || [],
          sdls: item?.transfert_details_comfirmation || [],
          dateTransfert: item?.transfer_date || "-",
          dateReception: "-",
          usinageQuantitiesTotal: item?.total_quantite_confirme || 0,
          status: item?.pret_usine || "",
        })) || [];
        setReceptionsAllList(pendingMapped);
        setTotalCount(pendingRes?.count || 0);
      } else if (tab === "Finalisé") {
        const confirmedRes = await fetchData("get", `cafe/usinages/`, { params: { processing_status: "TERMINE", limit, offset: pointer } });
        const confirmedMapped = confirmedRes?.results?.map((item) => ({
          id: item?.id,
          code_societe: item?.societe || "",
          societe: item?.nom_societe || "",
          //sdls: item?.transfert_details_comfirmation?.transfert_details_comfirmation?.transfer?.sdl?.sdl_nom || [],
          sdls: item?.transfert_details_comfirmation || [],
          dateSortie: new Date(item?.date_fin).toLocaleDateString() || "-",
          dateUsinage: new Date(item?.date_debut).toLocaleDateString() || "-",
          usinageQuantitiesTotal: item?.quantite_total || 0,
          status: item?.processing_status || "",
        })) || [];
        setReceptionsAllList(confirmedMapped);
        setTotalCount(confirmedRes?.count || 0);
      }
    } catch (error) {
      console.error(`Error fetching data for tab ${tab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadDataForTab(activeTab);
  }, [activeTab, pointer, limit]);

  const [pretUsinageNbr, setPretUsinageNbr] = React.useState(0);
  const [encoursUsinageNbr, setEncoursUsinageNbr] = React.useState(0);
  const [finaliseNbr, setFinaliseNbr] = React.useState(0);

  const handleLoadPretUsinageNbr = async () => {
    try {
      const res = await fetchData("get", `cafe/transfert_sdl_usine_detail_comfimation/get_transfert_comfirmed_par_societe/`, { params: { pret_usine: "PRET_USINE" } });
      setPretUsinageNbr(res?.count || 0);
    } catch (error) {
      console.error("Error loading pret usinage nbr:", error);
    }
  };

  const handleLoadEncoursUsinageNbr = async () => {
    try {
      const res = await fetchData("get", `cafe/transfert_sdl_usine_detail_comfimation/get_transfert_comfirmed_par_societe/`, { params: { etat_selection: "EN_COURS" } });
      setEncoursUsinageNbr(res?.count || 0);
      console.log(res)
    } catch (error) {
      console.error("Error loading encours usinage nbr:", error);
    }
  };

  const handleLoadFinaliseUsinageNbr = async () => {
    try {
      const res = await fetchData("get", `cafe/usinages/`, { params: { processing_status: "TERMINE" } });
      setFinaliseNbr(res?.count || 0);
    } catch (error) {
      console.error("Error loading finalise usinage nbr:", error);
    }
  };

  React.useEffect(() => {
    handleLoadPretUsinageNbr();
    handleLoadEncoursUsinageNbr();
    handleLoadFinaliseUsinageNbr();
  }, []);
  return (
    <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Suivi des Lots en Usinage
        </CardTitle>
        <CardDescription>
          Liste des lots en cours d'usinage et historique des lots finalisés.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {receptionsAllList.length >= 0 && (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="flex w-full overflow-x-auto justify-start h-10 p-1 bg-slate-100 dark:bg-slate-900 select-none mb-4 gap-1">

              <TabsTrigger value="Reception" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <Layers className="h-3.5 w-3.5 text-slate-500" />
                <span>Pretes à l'usinage ({pretUsinageNbr})</span>
              </TabsTrigger>
              <TabsTrigger value="En cours" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>En cours ({encoursUsinageNbr})</span>
              </TabsTrigger>
              <TabsTrigger value="Finalisé" className="flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Finalisé ({finaliseNbr})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {receptionsAllList.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aucun lot enregistré pour le moment. Utilisez le formulaire ci-dessus pour lancer un usinage.
            </p>
          </div>
        ) : filteredLots.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aucun lot "{activeTab === "Trié & Stocké (Direct)" ? "Stocké (Direct)" : activeTab}" pour le moment.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Société & SDLs</TableHead>
                {activeTab === "Finalisé" && (
                  <TableHead>Date d'Usinage</TableHead>
                )}
                <TableHead>Quantité</TableHead>
                <TableHead >Statut</TableHead>
                {activeTab === "Finalisé" && (
                  <TableHead>Date Sortie</TableHead>
                )}
                <TableHead className="text-right bg-red-900 sticky right-0 bg-side/bar shadow-2xl">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receptionsAllList.map((lot, index) => {
                const isFinished = lot.status === "TERMINE";
                const isReadyForUsinage = lot.status === "PRET_USINE";
                const isInProcess = lot.status === "EN_COURS";
                return (
                  <TableRow key={lot.id}>
                    <TableCell className="font-bold text-slate-900 dark:text-white">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {lot.societe}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {Array.from(
                            new Set(
                              (lot?.sdls || [])
                                .map((sdl) => sdl?.transfert_detail?.transfer?.sdl?.sdl_nom)
                                .filter(Boolean)
                            )
                          ).map((sdlNom) => (
                            <span
                              key={sdlNom}
                              className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                            >
                              {sdlNom}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    {isFinished && (
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {lot.dateUsinage}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex flex-col gap-1">

                        <div className="text-xs flex items-center gap-1.5">
                          <span className="text-slate-600 dark:text-slate-400">
                            {lot.usinageQuantitiesTotal} kg
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isFinished && (
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Finalisé
                        </Badge>
                      )}
                      {isInProcess && (
                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                          En cours
                        </Badge>
                      )}
                      {isReadyForUsinage && (
                        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800 flex items-center gap-1">
                          <Settings className="h-3.5 w-3.5" />
                          Pretes à l'usinage
                        </Badge>
                      )}
                    </TableCell>
                    {isFinished && (
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {lot.dateSortie}
                      </TableCell>
                    )}
                    <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                      {isFinished && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetails(lot?.id)}
                          className="h-8 text-xs flex items-center gap-1.5 ml-auto bg-sidebar"
                        >
                          <Eye className="h-3.5 w-3.5" /> Détails
                        </Button>
                      )}
                      {isInProcess && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onFinalize(lot)}
                          className="h-8 text-xs flex items-center gap-1.5 ml-auto"
                        >
                          <Play className="h-3.5 w-3.5" /> Finaliser
                        </Button>
                      )}
                      {isReadyForUsinage && (
                        <InputForm
                          id={lot.id}
                          code_societe={lot.code_societe}
                          societe={lot.societe}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

        )}
        {receptionsAllList.length > 0 && (
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
            <div className="flex-1 text-sm text-muted-foreground"></div>
            <PaginationContent
              datapaginationlimit={(l) => { }}
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / limit) || 1}
              onPageChange={onPageChange}
              pointer={pointer}
              totalCount={totalCount}
              onLimitChange={onLimitChange}
              limit={limit}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}