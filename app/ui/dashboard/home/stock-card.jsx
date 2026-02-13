"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, DollarSign, TrendingUp } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { StockCardSkeleton } from "@/components/ui/skeletons";

export function StockSummaryCard() {
  const [data, setData] = React.useState({});
  const [grade_a1, setGradeA1] = React.useState(0);
  const [grade_a2, setGradeA2] = React.useState(0);
  const [grade_a3, setGradeA3] = React.useState(0);
  const [grade_b1, setGradeB1] = React.useState(0);
  const [grade_b2, setGradeB2] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const getDatas = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData(
          "get",
          `/cafe/achat_cafe/get_total_achat/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const rendement = await fetchData(
          "get",
          `/cafe/detail_rendements/get_rendement_cerise_total_group_by_grade/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        setData(response);
        rendement.forEach((item) => {
          if (item.grade__grade_name === "A1") {
            setGradeA1(item.total_cerise);
          } else if (item.grade__grade_name === "A2") {
            setGradeA2(item.total_cerise);
          } else if (item.grade__grade_name === "A3") {
            setGradeA3(item.total_cerise);
          } else if (item.grade__grade_name === "B1") {
            setGradeB1(item.total_cerise);
          } else if (item.grade__grade_name === "B2") {
            setGradeB2(item.total_cerise);
          }
        });
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDatas();
  }, []);

  if (isLoading) {
    return <StockCardSkeleton />;
  }

  return (
    <Card className="@container/stock h-full">
      <CardHeader>
        <div className="flex flex-row gap-x-2 items-center">
          <div className="bg-destructive p-2 rounded-md">
            <Package className="text-white" />
          </div>
          <CardTitle className="text-lg font-semibold">
            Stock Actuel SDLs
          </CardTitle>
        </div>
        <CardDescription>
          État des stocks en temps réel des (SDLs)
        </CardDescription>
      </CardHeader>

      <CardContent className="grid">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 p-3 bg-primary/10 rounded-lg">
            <span className="font-medium text-muted-foreground">Cerise A</span>
            <span className="text-2xl font-bold text-primary">
              {" "}
              {data?.total_cerise_a_achat >= 1000 ? (
                <>
                  {(data?.total_cerise_a_achat / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {data?.total_cerise_a_achat?.toLocaleString("fr-FR") || 0}
                  <span className="text-base">Kg</span>
                </>
              )}
            </span>
            <span className="text-sm font-medium">
              {(data?.total_montant_cerise_a_achat ?? 0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              FBU (Estimé)
            </span>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-secondary/10 rounded-lg">
            <span className="font-medium text-muted-foreground">Cerise B</span>

            <span className="text-2xl font-bold text-secondary">
              {data?.total_cerise_b_achat >= 1000 ? (
                <>
                  {(data?.total_cerise_b_achat / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {data?.total_cerise_b_achat?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-base">Kg</span>
                </>
              )}
            </span>
            <span className="text-sm font-medium">
              {(data?.total_montant_cerise_b_achat ?? 0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              FBU (Estimé)
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 ml-6">
          <div className="flex flex-col gap-1 p-3 border-l-2 border-l-primary">
            <span className="font-medium">Grades A</span>
            <div className="flex flex-wrap gap-4 text-sm  text-muted-foreground">
              <div className="flex flex-col">
                <span className="text-base">
                  A1 :
                  {grade_a1 >= 1000 ? (
                    <>
                      {(grade_a1 / 1000).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <span className="text-sm"> T</span>
                    </>
                  ) : (
                    <>
                      {grade_a1?.toLocaleString("fr-FR") || 0}
                      <span className="text-sm"> Kg</span>
                    </>
                  )}
                </span>
                <span className="text-base">
                  A2 :{" "}
                  {grade_a2 >= 1000 ? (
                    <>
                      {(grade_a2 / 1000).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <span className="text-sm"> T</span>
                    </>
                  ) : (
                    <>
                      {grade_a2?.toLocaleString("fr-FR") || 0}
                      <span className="text-sm"> Kg</span>
                    </>
                  )}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-base">
                  A3 :{" "}
                  {grade_a3 >= 1000 ? (
                    <>
                      {(grade_a3 / 1000).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <span className="text-sm"> T</span>
                    </>
                  ) : (
                    <>
                      {grade_a3?.toLocaleString("fr-FR") || 0}
                      <span className="text-sm"> Kg</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-3 border-l-2 border-l-secondary">
            <span className="font-medium">Grades B</span>
            <div className="flex flex-wrap gap-4 text-sm  text-muted-foreground">
              <div className="flex flex-col">
                <span className="text-base">
                  B1 :
                  {grade_b1 >= 1000 ? (
                    <>
                      {(grade_b1 / 1000).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <span className="text-sm"> T</span>
                    </>
                  ) : (
                    <>
                      {grade_b1?.toLocaleString("fr-FR") || 0}
                      <span className="text-sm"> Kg</span>
                    </>
                  )}
                </span>
                <span className="text-base">
                  B2 :
                  {grade_b2 >= 1000 ? (
                    <>
                      {(grade_b2 / 1000).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <span className="text-sm"> T</span>
                    </>
                  ) : (
                    <>
                      {grade_b2?.toLocaleString("fr-FR") || 0}
                      <span className="text-sm"> Kg</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between p-0 md:p-3 border/5 rounded-lg mt-2">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-1.5 rounded-full dark:bg-green-900">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Valeur Totale</span>
              <span className="text-xs text-muted-foreground">Estimée</span>
            </div>
          </div>
          <span className="text-xl font-bold tabular-nums">
            {" "}
            {(data?.total_montant_achat ?? 0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
            FBU
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
