"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageCheck, AlertCircle, Eye, Warehouse } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchData } from "@/app/_utils/api";
import { useSearchParams } from "next/navigation";

export default function TabNouveauLot({ searchQuery = "" }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [stockNouveauLotList, setStockNouveauLotList] = useState([]);
  const id = useSearchParams().get("id");
  const [limit, setLimit] = useState(5);
  const [pointer, setPointer] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setPointer((page - 1) * limit);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPointer(0);
    setCurrentPage(1);
  };
  const NOUVEAUX_LOTS = [
    {
      id: "NVL-001",
      societe: "COCOCA",
      sdls: ["SDL Gitega", "SDL Karusi"],
      dateEntree: "2026-05-28",
      totalSacs: 576,
      status: "Prêt à stocker",
      grades: {
        "ROBUSTA NATURAL CLEAN SUPER": 58,
        "FW NGOMA MILD-SDL": 420,
        "FW AA": 78,
        "W ABC": 20,
      },
    },
    {
      id: "NVL-002",
      societe: "SOGESTAL Kayanza",
      sdls: ["SDL Kayanza"],
      dateEntree: "2026-05-27",
      totalSacs: 60,
      status: "Prêt à stocker",
      grades: {
        "FW AA": 40,
        "15+": 20,
      },
    },
  ];

  const filtered = NOUVEAUX_LOTS.filter((lot) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lot.societe.toLowerCase().includes(q) ||
      lot.id.toLowerCase().includes(q) ||
      lot.sdls.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleOpen = (lot) => {
    setSelectedLot(lot);
    setOpen(true);
  };
  React.useEffect(() => {
    const handleFetchData = async () => {
      //setLoading(true);
      try {
        const response = await fetchData("get", `cafe/stock_cafe/get_qualites_pretes_stockage/`, { params: { usine_deparchage_id: id, offset: pointer, limit: limit } });
        const mappedData = response?.results?.map((item) => ({
          id: item?.id_initial,
          societe: item?.nom_societe,
          grades: item?.qualites,
          totalSacs: item?.qualites?.reduce((acc, grade) => acc + grade?.nombre_sacs_restant, 0),
          poids_net: item?.quantite_cafe_vert,
          date_enregistrement: item?.created_at,
          observation: item?.observation,

        })) || [];
        setStockNouveauLotList(mappedData);
        setTotalCount(response?.count || 0);
      } catch (error) {
        console.error(`Error fetching data for tab pretes usinage:`, error);
      } finally {
        setLoading(false);
      }
    };
    handleFetchData();

  }, [limit, pointer, id]);

  return (
    <div className="space-y-4">
      <div className="grid w-full [&>div]:border [&>div]:rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Propriétaire / Société</TableHead>
              <TableHead>Grade / Qualité</TableHead>
              <TableHead className="text-right">Nombre de Sacs</TableHead>
              <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl border-l">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500 font-medium">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : stockNouveauLotList?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500 font-medium">
                  <div className="flex flex-col items-center gap-1.5">
                    <AlertCircle className="h-6 w-6 text-slate-400" />
                    <span>Aucun nouveau lot prêt à être stocké.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              stockNouveauLotList?.map((lot, index) => (
                <TableRow key={lot.id} className="odd:bg-muted/50">
                  <TableCell className="font-bold text-slate-900 dark:text-white">
                    {pointer + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {lot.societe}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {lot.grades && lot.grades.map((grade, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-xs bg-secondary/10 text-secondary dark:bg-secondary/30 dark:text-secondary dark:border-secondary/30"
                        >
                          {grade?.qualite} ({grade?.nombre_sacs_restant} sacs)
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                    {lot.totalSacs ?? 0}
                  </TableCell>
                  <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpen(lot)}
                      className="h-8 text-xs flex items-center gap-1.5 ml-auto bg-sidebar"
                    >
                      <Eye className="h-3.5 w-3.5" /> Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationContent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pointer={pointer}
        totalCount={totalCount}
        limit={limit}
        onLimitChange={handleLimitChange}
      />

      {/* Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-primary" />
              Détails du Nouveau Lot ({selectedLot?.id})
            </DialogTitle>
          </DialogHeader>
          {selectedLot && (
            <div className="space-y-4 pt-2">
              <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-lg text-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary">{selectedLot.societe}</span>
                  <Badge variant="outline">{selectedLot.status}</Badge>
                </div>
                <div className="text-xs text-slate-500">
                  Total : {selectedLot.totalSacs} sacs
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                  Grades et Nombres de Sacs Prêts
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedLot.grades && selectedLot.grades.map((grade, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-md border text-xs flex justify-between items-center">
                      <span className="font-semibold">{grade?.qualite}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{grade?.nombre_sacs_restant} sacs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
