"use client";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Archive,
  Banknote,
  ChartColumnBig,
  CircleDollarSign,
  Grape,
  ShoppingCart,
} from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { StatsCardSkeleton } from "@/components/ui/skeletons";
import { Separator } from "@/components/ui/separator";
export function SectionCards() {
  const [data, setData] = React.useState({});
  const [rendement, setRendement] = React.useState({});
  const [cafe_vert_produit, setCafeVertProduit] = React.useState({});
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
          `/cafe/detail_rendements/get_rendement_cerise_total/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const cafe_vert = await fetchData(
          "get",
          `cafe/usinages/get_cafe_vert_produits/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );

        setData(response);
        setRendement(rendement);
        setCafeVertProduit(cafe_vert);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDatas();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-7">
        <div className="col-span-3">
          <StatsCardSkeleton />
        </div>
        <div className="col-span-2">
          <StatsCardSkeleton />
        </div>
        <div className="col-span-2">
          <StatsCardSkeleton />
        </div>
      </div>
    );
  }
  const formatUnit = (val) => {
    if (!val) return { v: "0,00", u: "Kg" };
    return val >= 1000
      ? {
          v: (val / 1000).toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          u: "T",
        }
      : { v: val.toLocaleString("fr-FR"), u: "Kg" };
  };

  const total = data?.total_cerise_achat || 0;
  const percentageA =
    total > 0 ? ((data?.total_cerise_a_achat || 0) / total) * 100 : 0;
  const percentageB =
    total > 0 ? ((data?.total_cerise_b_achat || 0) / total) * 100 : 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-7">
      <Card className="@container/card col-span-3 relative">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Archive className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
              {data?.total_cerise_achat >= 1000 ? (
                <>
                  {(data?.total_cerise_achat / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {data?.total_cerise_achat?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-sm">Kg</span>
                </>
              )}
            </CardTitle>
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums  ">
            Qte collectee (CAB)
          </CardTitle>

          <div className="mt-2 space-y-3 w-full">
            <div className="flex justify-between items-end">
              <span className="text-xs text-muted-foreground ">
                Rapport Cerise A / B
              </span>
              {/* <span className="text-[10px] font-mono text-muted-foreground">
                Ratio: 65%
              </span> */}
            </div>
            {/* Barre de progression professionnelle */}
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="bg-primary/90"
                style={{ width: `${percentageA}%` }}
              />
              <div
                className="bg-secondary/90"
                style={{ width: `${percentageB}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-y-2 justify-between text-xs font-medium">
              <div className="flex flex-row gap-x-2 items-center bg-primary/10 py-1 px-2 rounded-lg w-max">
                <span className="text-primary flex items-center gap-1">●</span>
                <div className="flex flex-row gap-x-1 items-center">
                  <Grape className="text-primary size-5" />
                  <CardTitle className="text-md font-semibold text-primary">
                    CA :
                  </CardTitle>
                </div>
                <CardDescription className="font-semibold text-accent-foreground text-lg">
                  {data?.total_cerise_a_achat >= 1000 ? (
                    <>
                      {(data?.total_cerise_a_achat / 1000).toLocaleString(
                        "fr-FR",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}{" "}
                      <span className="text-sm">T</span>
                    </>
                  ) : (
                    <>
                      {data?.total_cerise_a_achat?.toLocaleString("fr-FR") || 0}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    ({percentageA.toFixed(1)}%)
                  </span>
                </CardDescription>
              </div>
              <span className="w-0.5 h-8 bg-black/20 hidden lg:block"></span>
              <div className="flex flex-row gap-x-2 items-center bg-secondary/10 py-1 px-2 rounded-lg">
                <span className="text-secondary flex items-center gap-1">
                  ●
                </span>
                <div className="flex flex-row gap-x-1 items-center">
                  <Grape className="text-secondary size-5" />
                  <CardTitle className="text-md font-semibold text-secondary">
                    CB :
                  </CardTitle>
                </div>
                <CardDescription className="font-semibold text-accent-foreground text-lg">
                  {data?.total_cerise_b_achat >= 1000 ? (
                    <>
                      {(data?.total_cerise_b_achat / 1000).toLocaleString(
                        "fr-FR",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                      <span className="text-sm">T</span>
                    </>
                  ) : (
                    <>
                      {data?.total_cerise_b_achat?.toLocaleString("fr-FR") || 0}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    ({percentageB.toFixed(1)}%)
                  </span>
                </CardDescription>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-1 mt-2 ">
            <div className="flex flex-row gap-x-2 items-center">
              <div className="rounded-md">
                <CircleDollarSign className="text-yellow-500 size-4" />
              </div>
              <CardTitle className="text-sm text-muted-foreground font-medium tabular-nums">
                Montant total
              </CardTitle>
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
              {(data?.total_montant_achat ?? 0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                FBU
              </span>
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card col-span-2 h-max">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-chart-2 p-2 rounded-md">
              <ChartColumnBig className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
              {rendement?.total_cerise >= 1000 ? (
                <>
                  {(rendement?.total_cerise / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <span className="text-sm"> T</span>
                </>
              ) : (
                <>
                  {rendement?.total_cerise?.toLocaleString("fr-FR") || 0}
                  <span className="text-sm"> Kg</span>
                </>
              )}
            </CardTitle>
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums  ">
            Rendement cerise
          </CardTitle>
          {/* <CardAction>
            <Badge variant="secondary">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex flex-row ">
          <div className="flex flex-wrap justify-between text-xs font-medium w-full">
            <div className="flex flex-row gap-x-2 items-center bg-primary/10 py-1 px-2 rounded-lg w-max">
              <div className="flex flex-row gap-x-1 items-center">
                <Grape className="text-primary size-5" />
                <CardTitle className="text-md font-semibold text-primary">
                  CA :
                </CardTitle>
              </div>
              <CardDescription className="font-semibold text-accent-foreground text-lg">
                {rendement?.quantite_cerise_a_grade >= 1000 ? (
                  <>
                    {(rendement?.quantite_cerise_a_grade / 1000).toLocaleString(
                      "fr-FR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                    <span className="text-sm"> T</span>
                  </>
                ) : (
                  <>
                    {rendement?.quantite_cerise_a_grade?.toLocaleString(
                      "fr-FR",
                    ) || 0}
                    <span className="text-sm"> Kg</span>
                  </>
                )}
              </CardDescription>
            </div>
            <span className="w-0.5 h-8 bg-black/20"></span>
            <div className="flex flex-row gap-x-2 items-center bg-secondary/10 py-1 px-2 rounded-lg">
              <div className="flex flex-row gap-x-1 items-center">
                <Grape className="text-secondary size-5" />
                <CardTitle className="text-md font-semibold text-secondary">
                  CB :
                </CardTitle>
              </div>
              <CardDescription className="font-semibold text-accent-foreground text-lg">
                {rendement?.quantite_cerise_b_grade >= 1000 ? (
                  <>
                    {(rendement?.quantite_cerise_b_grade / 1000).toLocaleString(
                      "fr-FR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                    <span className="text-sm"> T</span>
                  </>
                ) : (
                  <>
                    {rendement?.quantite_cerise_b_grade?.toLocaleString(
                      "fr-FR",
                    ) || 0}
                    <span className="text-sm"> Kg</span>
                  </>
                )}
              </CardDescription>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card col-span-2 h-max">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-secondary p-2 rounded-md">
              <Grape className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
              {cafe_vert_produit?.total_cafe_vert >= 1000 ? (
                <>
                  {(cafe_vert_produit?.total_cafe_vert / 1000).toLocaleString(
                    "fr-FR",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                  <span className="text-sm">T</span>
                </>
              ) : (
                <>
                  {cafe_vert_produit?.total_cafe_vert?.toLocaleString(
                    "fr-FR",
                  ) || 0}{" "}
                  <span className="text-sm">Kg</span>
                </>
              )}
            </CardTitle>
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums  ">
            Cafe vert
          </CardTitle>
          <div className="hidden flex-col gap-y-1">
            <div className="flex flex-row gap-x-2 items-center">
              <div className="rounded-md">
                <CircleDollarSign className="text-yellow-500" />
              </div>
              <CardTitle className="text-lg text-muted-foreground font-medium tabular-nums  ">
                Montant
              </CardTitle>
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
              0 <span className="text-base">FBU</span>
            </CardTitle>
            <div className="text-muted-foreground">≈ 194 559 456 $</div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
