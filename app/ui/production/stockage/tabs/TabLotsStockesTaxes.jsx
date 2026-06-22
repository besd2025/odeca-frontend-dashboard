import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PackageCheck, AlertCircle } from "lucide-react";
import PaginationContent from "@/components/ui/pagination-content";
import { fetchData } from "@/app/_utils/api";

export default function TabLotsStockesTaxes() {
  const [lots, setLots] = useState([]);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        // TODO: Replace with the correct API endpoint for Stocked & Taxes when ready
        // Currently using get_qualites_stockees as a placeholder
        const lotsData = await fetchData("get", `cafe/stock_cafe/get_qualites_stockees/`, { params: { limit: 10000, offset: 0 } });
        const formattedLots = lotsData?.results?.map(item => {
          const processedGrades = Array.isArray(item?.qualites)
            ? item.qualites.reduce((acc, curr) => {
              acc[curr.qualite || `Qualité ${curr.qualite || 'Inconnue'}`] = curr.nombre_sacs_restant || curr.quantite || 0;
              return acc;
            }, {})
            : (item?.qualites || {});

          return {
            id: item?.stock_id,
            societe: item?.nom_societe,
            lotNumbers: item?.stock_lot,
            sdls: [],
            grades: processedGrades,
            dateEntree: item?.created_at?.split("T")[0],
            status: "Prêt à stocker",
            remainingQuantities: { ...processedGrades },
            nombreSacs: item?.total_sacs,
            dateStockage: item?.date_stockage,
          };
        });
        setLots(formattedLots || []);
      } catch (error) {
        console.error("Error fetching lots:", error);
      }
    };

    fetchLots();
  }, []);

  return (
    <Card className="shadow-xs dark:bg-slate-950 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <PackageCheck className="h-5 w-5 text-primary" /> Lots stockés & taxes
        </CardTitle>
        <CardDescription>
          Lots stockés & taxes prets pour exportation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {lots.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aucun lots stockés.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nouveau lot</TableHead>
                <TableHead>Propriétaire / Société</TableHead>
                <TableHead>Grade / Qualité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lots?.map((lot) => (
                <TableRow key={lot.id}>
                  <TableCell className="flex  gap-2 bg-sidebar dark:bg-slate-900">
                    {lot.id}
                  </TableCell>
                  <TableCell>
                    {lot?.societe}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(lot.grades).map((grade) => (
                        <Badge
                          key={grade}
                          variant="secondary"
                          className="text-xs bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary dark:border-primary/30"
                        >
                          {grade}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <PaginationContent />
      </CardContent>
    </Card>
  );
}
