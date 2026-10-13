import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageCheck, AlertCircle, MoreHorizontal } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchData } from "@/app/_utils/api";

export default function TabNouveauLot({ onViewDetails, handleOpenStocking }) {
  const [lots, setLots] = useState([]);

  // Pagination states
  const [limit, setLimit] = useState(5);
  const [pointer, setPointer] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPointer((pageNumber - 1) * limit);
  };

  const onLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPointer(0);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const lotsData = await fetchData("get", `cafe/stock_cafe/get_qualites_pretes_stockage/`, { 
          params: { limit, offset: pointer } 
        });

        const formattedLots = lotsData?.results?.map(item => {
          const processedGrades = Array.isArray(item?.qualites)
            ? item.qualites.reduce((acc, curr) => {
              acc[curr.qualite || `Qualité ${curr.qualite || 'Inconnue'}`] = curr.nombre_sacs_restant || curr.quantite || 0;
              return acc;
            }, {})
            : (item?.qualites || {});

          const totalSacs = Array.isArray(item?.qualites)
            ? item.qualites.reduce((sum, curr) => sum + (curr.nombre_sacs_restant || 0), 0)
            : 0;

          return {
            id: item?.societe_id,
            societe: item?.nom_societe,
            sdls: [],
            grades: processedGrades,
            dateEntree: item?.created_at?.split("T")[0],
            status: "Prêt à stocker",
            remainingQuantities: { ...processedGrades },
            totalSacs,
          };
        });
        console.log(formattedLots)
        setLots(formattedLots || []);
        setTotalCount(lotsData?.count || 0);
      } catch (error) {
        console.error("Error fetching lots:", error);
      }
    };

    fetchLots();
  }, [limit, pointer]);

  return (
    <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <PackageCheck className="h-5 w-5 text-primary" /> Nouveau lot
        </CardTitle>
        <CardDescription>
          Nouveau lot prets à être stockés
        </CardDescription>
      </CardHeader>
      <CardContent>
        {lots.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aucun lots après triage.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Propriétaire / Société</TableHead>
                <TableHead>Grade / Qualité</TableHead>
                <TableHead className="text-right">Nombre de Sacs</TableHead>
                <TableHead className="text-right sticky right-0 bg-sidebar shadow-2xl">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lots?.map((lot, index) => (
                <TableRow key={lot.id}>
                  <TableCell className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {pointer + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {lot?.societe}
                      </span>
                      {lot?.sdls && lot?.sdls?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {lot?.sdls?.map((sdl) => (
                            <span
                              key={sdl}
                              className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded"
                            >
                              {sdl}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {lot?.grades &&
                        Object.keys(lot?.grades).map((grade) => (
                          <Badge
                            key={grade}
                            variant="secondary"
                            className="text-xs bg-secondary/10 text-secondary dark:bg-secondary/30 dark:text-secondary dark:border-secondary/30"
                          >
                            {grade}
                          </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                    {lot.totalSacs ?? 0}
                  </TableCell>
                  <TableCell className="text-right sticky right-0 bg-background shadow-2xl border-l border-slate-200 dark:border-slate-800">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="text-muted-foreground font-normal text-xs">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => onViewDetails(lot)}
                        >
                          Détails
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenStocking(lot)}
                          className="text-primary"
                        >
                          <PackageCheck className="h-3.5 w-3.5 text-primary" /> Stocker
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <PaginationContent
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / limit)}
          onPageChange={onPageChange}
          pointer={pointer}
          totalCount={totalCount}
          onLimitChange={onLimitChange}
          limit={limit}
        />
      </CardContent>
    </Card>
  );
}
