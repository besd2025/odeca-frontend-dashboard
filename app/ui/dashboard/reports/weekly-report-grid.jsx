"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";

export default function WeeklyReportGrid({ items = [], type = "SDL", readOnly = false, dateFrom, dateTo }) {
  // Initialiser le state avec les données reçues
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({

  })
  useEffect(() => {
    // Transformer les items en un format gérable par le state
    const initialData = items.map((item) => ({
      id: item.id,
      responsable_id: item.responsable_id,
      name: item.name,
      ca: item.ca || "",
      cb: item.cb || "",

    }));
    setData(initialData);
  }, [items]);

  // Gérer la mise à jour d'un champ
  const handleChange = (id, field, value) => {
    if (readOnly) return;
    setData((prevData) =>
      prevData.map((row) => {
        if (row.id === id) {
          // Validation de base pour s'assurer que seuls les nombres positifs sont entrés pour ca et cb
          if ((field === "ca" || field === "cb") && value !== "" && Number(value) < 0) {
            setFormData({
              row
            })
            return row;
          }
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const handleSend = async () => {
    if (!dateFrom || !dateTo) {
      toast.error("Veuillez sélectionner une période (Date début et Date fin)");
      return;
    }

    // Filtrer les lignes qui ont au moins une valeur saisie pour éviter d'envoyer des rapports vides si nécessaire
    // Mais ici le code original envoyait tout, donc on garde l'envoi de tout pour être sûr.

    try {
      const promises = data.map((item) => {
        const payload = {
          sdl_ct: item.responsable_id,
          quantite_cerise_a: Number(item.ca) || 0,
          quantite_cerise_b: Number(item.cb) || 0,
          week_beginning: dateFrom,
          week_end: dateTo,
        };
        return fetchData("post", `cafe/rapportages_sdl_ct/`, {
          body: payload,
        });
      });

      const responses = await Promise.all(promises);

      const failures = responses.filter(res => res.status !== 201 && res.status !== 200);

      if (failures.length === 0) {
        toast.success("Tous les rapports ont été envoyés avec succès");
      } else if (failures.length < data.length) {
        toast.warning(`${data.length - failures.length} rapports envoyés, ${failures.length} échecs.`);
      } else {
        toast.error("Échec de l'envoi des rapports");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Une erreur est survenue lors de l'envoi");
    }
  };
  return (
    <Card className=" shadow-none p-1 ">
      <CardContent className="p-0">
        <div className="">
          <Table className="min-w-[700px]">
            <TableHeader className="">
              <TableRow>
                <TableHead className="w-[200px] md:w-[300px] font-semibold">Nom de la SDL/CT</TableHead>
                <TableHead className="w-[150px] font-semibold text-center">CA (kg)</TableHead>
                <TableHead className="w-[150px] font-semibold text-center">CB (kg)</TableHead>
                <TableHead className="w-[150px] font-semibold text-center">Total (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Aucune SDL/CT trouvée pour cette catégorie.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => {
                  const total = (Number(row.ca) || 0) + (Number(row.cb) || 0);

                  return (
                    <TableRow key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                      <TableCell className="font-medium align-middle">
                        <div className="flex items-center gap-2">
                          {row.name}
                        </div>
                      </TableCell>
                      <TableCell className="align-middle text-center p-2">
                        {readOnly ? (
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {(Number(row.ca) || 0).toLocaleString()}
                          </span>
                        ) : (
                          <Input
                            type="number"
                            min="0"
                            value={row.ca}
                            onChange={(e) => handleChange(row.id, "ca", e.target.value)}
                            className="text-center  border-gray-200 dark:border-zinc-800 h-10 w-full hover:border-blue-400 focus:border-blue-500 transition-colors"
                            placeholder="0"
                          />
                        )}
                      </TableCell>
                      <TableCell className="align-middle text-center p-2">
                        {readOnly ? (
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {(Number(row.cb) || 0).toLocaleString()}
                          </span>
                        ) : (
                          <Input
                            type="number"
                            min="0"
                            value={row.cb}
                            onChange={(e) => handleChange(row.id, "cb", e.target.value)}
                            className="text-center  border-gray-200 dark:border-zinc-800 h-10 w-full hover:border-blue-400 focus:border-blue-500 transition-colors"
                            placeholder="0"
                          />
                        )}
                      </TableCell>
                      <TableCell className="align-middle text-center font-bold text-gray-700 dark:text-gray-300">
                        <span className="bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 py-1.5 px-3 rounded-md w-full inline-block">
                          {total.toLocaleString()}
                        </span>
                      </TableCell>

                    </TableRow>
                  );
                })
              )}
            </TableBody>

          </Table>
          {!readOnly && (
            <div className="w-full">
              <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 border-t /50 p-6 mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Assurez-vous de vérifier les "Totaux" avant de valider votre semaine.
                </p>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button className="w-full sm:w-auto flex gap-2 bg-primary hover:bg-primary/90 text-white shadow-md" onClick={handleSend}>
                    <Send className="w-4 h-4" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
