"use client";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import React, { useContext } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
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
  Columns3Cog,
  Grape,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { StatsCardSkeleton } from "@/components/ui/skeletons";
import { Separator } from "@/components/ui/separator";
import { UserContext } from "@/app/ui/context/User_Context";
export function SectionCards() {
  const [data, setData] = React.useState({});
  const [rendement, setRendement] = React.useState({});
  const [cafe_vert_produit, setCafeVertProduit] = React.useState({});
  const [totalCultivators, setTotalCultivators] = React.useState(0);
  const [totalCts, setTotalCts] = React.useState(0);
  const [totalSdls, setTotalSdls] = React.useState(0);
  const [totalUdps, setTotalUdps] = React.useState(0);
  const [totalSocieties, setTotalSocieties] = React.useState(0);
  const [newToday, setNewToday] = React.useState(0);
  const [newQtyToday, setNewQtyToday] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const user = React.useContext(UserContext)
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

        const cultivators = await fetchData(
          "get",
          `/cafe/stationslavage/get_total_cultivators/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );

        const cts = await fetchData(
          "get",
          `cafe/centres_transite/get_active_and_non_active_ct/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );

        const sdls = await fetchData(
          "get",
          `cafe/stationslavage/get_active_and_non_active_sdl/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );

        const dailyStats = await fetchData(
          "get",
          `/cafe/stationslavage/cultivateurs_statistiques_par_temps?period=day`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );

        const dailyPurchaseStats = await fetchData(
          "get",
          `/cafe/stationslavage/get_recent_total_7_cultivators_per_days_or_weeks_or_months_for_line_chart?period=day`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );

        const udps = await fetchData(
          "get",
          `cafe/usine_deparchage/get_total_usine_deparchage/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );

        const societies = await fetchData(
          "get",
          `cafe/societes/`,
          {
            params: { limit: 1 },
            additionalHeaders: {},
            body: {},
          },
        );

        console.log("dailyPurchaseStats", dailyPurchaseStats);
        setData(response);
        setRendement(rendement);
        setCafeVertProduit(cafe_vert);
        setTotalCultivators(cultivators?.total_cultivators || 0);
        setTotalCts(cts?.total_ct || 0);
        setTotalSdls(sdls?.total_sdl || 0);
        setTotalUdps(udps?.total_usine_deparchage || 0);
        setTotalSocieties(societies?.count || 0);

        if (Array.isArray(dailyStats) && dailyStats.length > 0) {
          // On récupère le nombre de cultivateurs du jour le plus récent
          setNewToday(dailyStats[dailyStats.length - 1].nombre || 0);
        }

        if (Array.isArray(dailyPurchaseStats) && dailyPurchaseStats.length > 0) {
          // On récupère la quantité de cerise du jour le plus récent
          setNewQtyToday(
            dailyPurchaseStats[dailyPurchaseStats.length - 1].quantite_total || 0,
          );
        }
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
        <div className="col-span-1 lg:col-span-3">
          <StatsCardSkeleton />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <StatsCardSkeleton />
        </div>
        <div className="col-span-1 lg:col-span-2">
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
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-12">
      <Card className="@container/card col-span-12 @5xl/main:col-span-5 relative">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Archive className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
              {
                data?.total_cerise_achat >= 1000 ? (
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
              {user?.session?.category === "Cafe_Chef_societe" || user?.session?.category === "Superviseur_Regional" ? (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({data?.total_cerise_achat} kg)
                </span>
              ) : (
                <></>
              )}
            </CardTitle>
            {/* {newQtyToday > 0 && (
              <Badge
                variant="secondary"
                className="bg-green-100 dark:bg-green-600/60 text-green-700 dark:text-green-100 px-1 py-0 h-5 ml-4"
              >
                <IconTrendingUp size={12} className="mr-0.5" />+
                {newQtyToday >= 1000 ? (
                  <>
                    {(newQtyToday / 1000).toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    T
                  </>
                ) : (
                  <>{newQtyToday.toLocaleString("fr-FR")} Kg</>
                )}
              </Badge>
            )} */}
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
                  {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" ? (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({percentageA.toFixed(1)}%)
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({data?.total_cerise_a_achat} kg)
                    </span>
                  )}
                </CardDescription>
              </div>
              <span className="w-0.5 h-8 bg-black/20 hidden @5xl/main:block">
                <Separator orientation="vertical" />
              </span>
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
                  {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" ? (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({percentageB.toFixed(1)}%)
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({data?.total_cerise_b_achat} kg)
                    </span>
                  )}
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
              {Math.round(data?.total_montant_achat ?? 0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                FBU
              </span>
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card col-span-12 @5xl/main:col-span-4">
        <CardContent>
          <div>
            <div className="flex flex-row gap-x-2 items-center ml-2">
              <div className="bg-chart-2 p-1 rounded-md">
                <ChartColumnBig className="text-white" />
              </div>
              <CardTitle className="text-2xl @[250px]/card:text-2xl font-semibold tracking-tight tabular-nums">
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
            <CardTitle className="text-md font-medium tabular-nums ml-2 mt-2">
              Réndement cerise
            </CardTitle>
            {/* <CardAction>
            <Badge variant="secondary">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction> */}
            <div className="flex flex-wrap justify-between text-xs font-medium w-full mt-3">
              <div className="flex flex-col @5xl/main:flex-row justify-between gap-x-2 @5xl/main:items-center bg-background/70 py-1 px-2 rounded-lg w-full">
                <div className="flex flex-row gap-x-2 items-center bg-sec/ondary/10 py-1 px-2 rounded-lg">
                  <div className="flex flex-row gap-x-1 items-center">
                    <Grape className="text-primary size-5" />
                    <CardTitle className="text-md font-semibold text-primary">
                      CA :
                    </CardTitle>
                  </div>
                  <CardDescription className="font-semibold text-accent-foreground text-lg">
                    {rendement?.quantite_cerise_a_grade >= 1000 ? (
                      <>
                        {(
                          rendement?.quantite_cerise_a_grade / 1000
                        ).toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
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
                <span className="w-0.5 h-8 bg-black/20 hidden @5xl/main:block">
                  <Separator orientation="vertical" />
                </span>
                <div className="flex flex-row gap-x-2 items-center bg-sec/ondary/10 py-1 px-2 rounded-lg">
                  <div className="flex flex-row gap-x-1 items-center">
                    <Grape className="text-secondary size-5" />
                    <CardTitle className="text-md font-semibold text-secondary">
                      CB :
                    </CardTitle>
                  </div>
                  <CardDescription className="font-semibold text-accent-foreground text-lg">
                    {rendement?.quantite_cerise_b_grade >= 1000 ? (
                      <>
                        {(
                          rendement?.quantite_cerise_b_grade / 1000
                        ).toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
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
            </div>
          </div>
        </CardContent>
        {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" && (
          <CardContent>
            <div>
              <div className="flex flex-row gap-x-2 items-center ml-2">
                <div className="bg-secondary p-1 rounded-md">
                  <Grape className="text-white" />
                </div>
                <CardTitle className="text-2xl @[250px]/card:text-2xl font-semibold tracking-tight tabular-nums">
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
              <CardTitle className="text-md font-medium tabular-nums ml-2">
                Cafe vert
              </CardTitle>
              <div className="hidden flex-col gap-y-1">
                <div className="flex flex-row gap-x-2 items-center">
                  <div className="rounded-md">
                    <CircleDollarSign className="text-yellow-600" />
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
            </div>
          </CardContent>
        )}
        <CardFooter className="flex flex-row "></CardFooter>
      </Card>
      <Card className="@container/card col-span-12 @5xl/main:col-span-3">
        <CardContent>
          <div>
            <div className="flex flex-row gap-x-2 items-center ml-2">
              <div className="bg-primary p-1 rounded-md">
                <UsersRound size={20} className="text-white" />
              </div>
              <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
                {totalCultivators?.toLocaleString("fr-FR")}
              </CardTitle>
              {/* {newToday > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 dark:bg-green-600/60 text-green-700 dark:text-green-100 px-1 py-0 h-5 ml-1"
                >
                  <IconTrendingUp size={12} className="mr-0.5" />+{newToday}
                </Badge>
              )} */}
            </div>
            <CardTitle className="text-base font-normal ml-2 mt-1 ">
              Total caféiculteurs
            </CardTitle>
          </div>
        </CardContent>
        <div className="flex flex-row gap-x-2 justify-between mx-3 bg-background/70 py-2 px-2 rounded-lg">
          <div>
            <div>
              <div className="flex flex-row gap-x-1 items-center">
                <div className="bg-chart-3 p-1 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 text-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <CardTitle className="text-md font-semibold tracking-tight tabular-nums">
                  {totalCts?.toLocaleString("fr-FR")}
                </CardTitle>
              </div>
              <CardTitle className="text-sm font-normal ml-1 mt-1 ">
                CTs
              </CardTitle>
            </div>
          </div>
          <Separator orientation="vertical" />
          <div>
            <div>
              <div className="flex flex-row gap-x-1 items-center">
                <div className="bg-chart-3 p-1 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 text-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <CardTitle className="text-md font-semibold tracking-tight tabular-     nums">
                  {totalSdls?.toLocaleString("fr-FR")}
                </CardTitle>
              </div>
              <CardTitle className="text-sm font-normal ml-1 mt-1 ">
                SDLs
              </CardTitle>
            </div>
          </div>
          <Separator orientation="vertical" />
          <div>
            {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" && (
              <div>
                <div className="flex flex-row gap-x-1 items-center">
                  <div className="bg-chart-3 p-1 rounded-md">
                    <Columns3Cog className="size-5 text-white" />
                  </div>
                  <CardTitle className="text-md font-semibold tracking-tight tabular-nums">
                    {totalUdps?.toLocaleString("fr-FR")}
                  </CardTitle>
                </div>
                <CardTitle className="text-sm font-normal ml-1 mt-1 ">
                  UDPs
                </CardTitle>
              </div>
            )}
          </div>
        </div>
        {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" && (
          <CardContent>
            <div>
              <div className="flex flex-row gap-x-2 items-center ml-2">
                <div className="bg-secondary p-1 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 text-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                      clipRule="evenodd"
                    />
                    <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
                  </svg>
                </div>

                <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
                  {totalSocieties?.toLocaleString("fr-FR")}
                </CardTitle>
              </div>

              <CardTitle className="text-sm font-normal ml-2 mt-1 ">
                Sociétés
              </CardTitle>

            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
