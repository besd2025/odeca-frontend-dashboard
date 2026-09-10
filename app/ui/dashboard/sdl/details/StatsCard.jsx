import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Archive,
  Banknote,
  ChartColumn,
  CircleDollarSign,
  Grape,
  Landmark,
  Mars,
  PackageCheck,
  TruckElectric,
  Users,
  Venus,
} from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { SimpleCardSkeleton } from "@/components/ui/skeletons";
import { Separator } from "@/components/ui/separator";
import { UserContext } from "@/app/ui/context/User_Context";
function StatsCard({ id }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const user = React.useContext(UserContext)
  React.useEffect(() => {
    const getSdls = async () => {
      try {
        const qte_achete = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_total_achat_par_sdl/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );

        const nombre_cultivateurs = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_total_cultivators_sdl/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const transfertct_sdl = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_total_quantite_ct_transfert/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const transfert_get_ct = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_ct_transfert/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const rapportC = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_rendement_cerise_details/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const rapportCTotal = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_total_rendement_cerise_rapport_c/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const transfertUDPtotal = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_total_quantite_transfert/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const transfertUDPDetails = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_transfert_usine_details/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        console.log("transfertUDPtotal", transfertUDPtotal, "transfertUDPDetails", transfertUDPDetails);
        const response = { qte_achete, nombre_cultivateurs, transfertct_sdl, transfert_get_ct, rapportC, rapportCTotal, transfertUDPtotal, transfertUDPDetails };
        setData(response);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getSdls();
  }, [id]);

  const total = data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b || 0;
  const percentageA =
    total > 0 ? ((data?.qte_achete?.cerise_a || 0) / total) * 100 : 0;
  const percentageB =
    total > 0 ? ((data?.qte_achete?.cerise_b || 0) / total) * 100 : 0;
  const qte_cerise_a_totale = data?.qte_achete?.cerise_a + data?.transfertct_sdl?.quantite_cerise_a_confirme || 0;
  const qte_cerise_b_totale = data?.qte_achete?.cerise_b + data?.transfertct_sdl?.quantite_cerise_b_confirme || 0;
  const qte_cerise_totale = qte_cerise_a_totale + qte_cerise_b_totale
  const percentage_a_totale = qte_cerise_totale > 0 ? (qte_cerise_a_totale / qte_cerise_totale) * 100 : 0;
  const percentage_b_totale = qte_cerise_totale > 0 ? (qte_cerise_b_totale / qte_cerise_totale) * 100 : 0;
  const qte_parche_disponible = data?.rapportCTotal?.quantite_cafe_parche - data?.transfertUDPtotal?.quantite_cafe_parche || 0
  const [avance, setAvance] = React.useState(false);
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SimpleCardSkeleton />
        <SimpleCardSkeleton />
        <SimpleCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-13 gap-2">
      <Card className="@container/card col-span-1 lg:col-span-7 relative">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Archive className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
              {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) >= 1000 ? (
                <>
                  {((data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b)?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-sm">Kg</span>
                </>
              )}
            </CardTitle>
            {user?.session?.category === "Cafe_Chef_societe" || user?.session?.category === "Superviseur_Regional" ? (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b)?.toLocaleString("fr-FR")} kg)
              </span>
            ) : (
              <></>
            )}
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
                  {data?.qte_achete?.cerise_a >= 1000 ? (
                    <>
                      {(data?.qte_achete?.cerise_a / 1000).toLocaleString(
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
                      {data?.qte_achete?.cerise_a?.toLocaleString("fr-FR") || 0}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}

                  {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" ? (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({percentageA.toFixed(1)}%)
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({data?.qte_achete?.cerise_a?.toLocaleString("fr-FR")} kg)
                    </span>
                  )}

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
                  {data?.qte_achete?.cerise_b >= 1000 ? (
                    <>
                      {(data?.qte_achete?.cerise_b / 1000).toLocaleString(
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
                      {data?.qte_achete?.cerise_b?.toLocaleString("fr-FR") || 0}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}
                  {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" ? (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({percentageB.toFixed(1)}%)
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({data?.qte_achete?.cerise_b?.toLocaleString("fr-FR")} kg)
                    </span>
                  )}

                </CardDescription>
              </div>
            </div>
          </div>

        </CardHeader>
      </Card>
      <Card className="@container/card lg:col-span-3">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-yellow-500 p-2 rounded-md">
              <CircleDollarSign className="text-white" />
            </div>
            <CardTitle className="text-md text-muted-foreground font-medium tabular-nums  ">
              Montant
            </CardTitle>
          </div>
          <CardTitle className="text-lg font-semibold tracking-tight tabular-nums">
            {(
              data?.qte_achete?.montant_cerise_a +
              data?.qte_achete?.montant_cerise_b ?? 0
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
            <span className="text-base">FBU</span>
          </CardTitle>
          <Separator />
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-x-2 items-center justify-center">
              <div className="flex flex-row gap-x-1 items-center">
                <Banknote className="text-secondary" />
                <CardTitle className="text-muted-foreground font-normal text-sm  ">
                  Tranche 1
                </CardTitle>
              </div>
              <CardTitle className="text-base font-semibold tracking-tight tabular-nums">
                0 <span className="text-xs">FBU</span>
              </CardTitle>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-x-2 items-center justify-center">
              <div className="flex flex-row gap-x-0.5 items-center">
                <Banknote className="text-secondary" />
                <CardTitle className="text-muted-foreground font-normal text-sm  ">
                  Tranche 2
                </CardTitle>
              </div>
              <CardTitle className="text-base font-semibold tracking-tight tabular-nums">
                0 <span className="text-xs">FBU</span>
              </CardTitle>
            </div>
            {avance && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-x-2 items-center justify-center">
                  <div className="flex flex-row gap-x-1 items-center">
                    <Banknote className="text-secondary" />
                    <CardTitle className="text-muted-foreground font-normal text-sm  ">
                      Avance
                    </CardTitle>
                  </div>
                  <CardTitle className="text-base font-semibold tracking-tight tabular-nums">
                    0 <span className="text-xs">FBU</span>
                  </CardTitle>
                </div>
              </>
            )}
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card col-span-1 lg:col-span-3 p-2 h-max">
        <CardHeader className="p-2">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-secondary p-2 rounded-full">
              <Users className="text-white" />
            </div>
            <CardTitle className="font-normal flex flex-col   ">
              <span className="text-muted-foreground text-sm">
                Cafeiculteurs
              </span>
              <span className="text-lg font-semibold tracking-tight ">
                {(data?.nombre_cultivateurs?.hommes ?? 0) +
                  (data?.nombre_cultivateurs?.femmes ?? 0)}
              </span>
            </CardTitle>
          </div>
          <div className="flex flex-col gap-y-2 mt-4">
            <div className="flex flex-row ">
              <div className="text-muted-foreground flex gap-x-0.5">
                <span className="bg-backgrou/nd rounded">
                  <Mars />
                </span>
                Homme :
              </div>
              <div className="font-medium  ml-2">
                {data?.nombre_cultivateurs?.hommes}
              </div>
            </div>
            <div className="flex flex-row ">
              <div className="text-muted-foreground flex gap-x-0.5 ">
                <span className="">
                  <Venus />
                </span>
                Femme :
              </div>
              <div className="font-medium  ml-2">
                {data?.nombre_cultivateurs?.femmes || 0}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card col-span-1 lg:col-span-5 ">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div className="flex flex-row gap-x-2 items-center">
              <div className="bg-secondary p-2 rounded-md">
                <TruckElectric className="text-white size-4" />
              </div>
              <CardTitle className="text-lg font-semibold tracking-tight tabular-nums">
                {(data?.transfertct_sdl?.quantite_cerise_a + data?.transfertct_sdl?.quantite_cerise_b) >= 1000 ? (
                  <>
                    {((data?.transfertct_sdl?.quantite_cerise_a + data?.transfertct_sdl?.quantite_cerise_b) / 1000).toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    <span className="text-base">T</span>
                  </>
                ) : (
                  <>
                    {(data?.transfertct_sdl?.quantite_cerise_a + data?.transfertct_sdl?.quantite_cerise_b)?.toLocaleString("fr-FR") || 0}{" "}
                    <span className="text-sm">Kg</span>
                  </>
                )}
              </CardTitle>
              {user?.session?.category === "Cafe_Chef_societe" || user?.session?.category === "Superviseur_Regional" ? (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({(data?.transfertct_sdl?.quantite_cerise_a + data?.transfertct_sdl?.quantite_cerise_b)?.toLocaleString("fr-FR")} kg)
                </span>
              ) : (
                <></>
              )}
            </div>
            <CardTitle className="text-sm font-normal tabular-nums text-muted-foreground my-2">
              Qtes Transférées (CT)
            </CardTitle>
            <div className="flex flex-col h-full justify-between text-xs font-medium">
              <div className="flex flex-row gap-x-2 items-center py-1 px-2 rounded-lg w-max">
                <span className="text-primary flex items-center gap-1">●</span>
                <div className="flex flex-row gap-x-1 items-center">
                  <Grape className="text-primary size-4" />
                  <CardTitle className="text-md font-semibold text-primary">
                    CA :
                  </CardTitle>
                </div>
                <CardDescription className="font-semibold text-accent-foreground text-lg">
                  {data?.transfertct_sdl?.quantite_cerise_a >= 1000 ? (
                    <>
                      {(data?.transfertct_sdl?.quantite_cerise_a / 1000).toLocaleString(
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
                      {data?.transfertct_sdl?.quantite_cerise_a?.toLocaleString("fr-FR") || 0}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}

                  {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" ? (
                    ""
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({data?.transfertct_sdl?.quantite_cerise_a?.toLocaleString("fr-FR")} kg)
                    </span>
                  )}

                </CardDescription>
              </div>
              <div className="flex flex-row gap-x-2 items-center py-1 px-2 rounded-lg">
                <span className="text-secondary flex items-center gap-1">
                  ●
                </span>
                <div className="flex flex-row gap-x-1 items-center">
                  <Grape className="text-secondary size-4" />
                  <CardTitle className="text-md font-semibold text-secondary">
                    CB :
                  </CardTitle>
                </div>
                <CardDescription className="font-semibold text-accent-foreground text-lg">
                  {data?.transfertct_sdl?.quantite_cerise_b >= 1000 ? (
                    <>
                      {(data?.transfertct_sdl?.quantite_cerise_b / 1000).toLocaleString(
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
                      {data?.transfertct_sdl?.quantite_cerise_b?.toLocaleString("fr-FR") || 0}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}
                  {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" ? (
                    ""
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({data?.transfertct_sdl?.quantite_cerise_b?.toLocaleString("fr-FR")} kg)
                    </span>
                  )}

                </CardDescription>
              </div>
            </div>
          </div>
          <Separator orientation="vertical" className="h-full" />
          <div className="flex flex-col">
            <div className="flex flex-row gap-x-2 items-center">
              <div className="bg-secondary p-2 rounded-md">
                <PackageCheck className="text-white size-4" />
              </div>
              <CardTitle className="text-lg font-semibold tracking-tight tabular-nums">
                {(data?.transfertct_sdl?.quantite_cerise_a_confirme + data?.transfertct_sdl?.quantite_cerise_b_confirme) >= 1000 ? (
                  <>
                    {((data?.transfertct_sdl?.quantite_cerise_a_confirme + data?.transfertct_sdl?.quantite_cerise_b_confirme) / 1000).toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    <span className="text-base">T</span>
                  </>
                ) : (
                  <>
                    {(data?.transfertct_sdl?.quantite_cerise_a_confirme + data?.transfertct_sdl?.quantite_cerise_b_confirme)?.toLocaleString("fr-FR") || 0}{" "}
                    <span className="text-sm">Kg</span>
                  </>
                )}
              </CardTitle>
              {user?.session?.category === "Cafe_Chef_societe" || user?.session?.category === "Superviseur_Regional" ? (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({(data?.transfertct_sdl?.quantite_cerise_a_confirme + data?.transfertct_sdl?.quantite_cerise_b_confirme)?.toLocaleString("fr-FR")} kg)
                </span>
              ) : (
                <></>
              )}
            </div>
            <CardTitle className="text-sm font-normal tabular-nums text-muted-foreground my-2">
              Qtes Reçues
            </CardTitle>
            <div className="flex flex-col h-full justify-between text-xs font-medium">
              <div className="flex flex-row gap-x-2 items-center py-1 px-2 rounded-lg w-max">
                <span className="text-primary flex items-center gap-1">●</span>
                <div className="flex flex-row gap-x-1 items-center">
                  <Grape className="text-primary size-4" />
                  <CardTitle className="text-md font-semibold text-primary">
                    CA :
                  </CardTitle>
                </div>
                <CardDescription className="font-semibold text-accent-foreground text-lg">
                  {data?.transfertct_sdl?.quantite_cerise_a_confirme >= 1000 ? (
                    <>
                      {(data?.transfertct_sdl?.quantite_cerise_a_confirme / 1000).toLocaleString(
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
                      {data?.transfertct_sdl?.quantite_cerise_a_confirme?.toLocaleString("fr-FR") || 0}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}

                  {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" ? (
                    ""
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({data?.transfertct_sdl?.quantite_cerise_a_confirme?.toLocaleString("fr-FR")} kg)
                    </span>
                  )}

                </CardDescription>
              </div>
              <div className="flex flex-row gap-x-2 items-center py-1 px-2 rounded-lg">
                <span className="text-secondary flex items-center gap-1">
                  ●
                </span>
                <div className="flex flex-row gap-x-1 items-center">
                  <Grape className="text-secondary size-4" />
                  <CardTitle className="text-md font-semibold text-secondary">
                    CB :
                  </CardTitle>
                </div>
                <CardDescription className="font-semibold text-accent-foreground text-lg">
                  {data?.transfertct_sdl?.quantite_cerise_b_confirme >= 1000 ? (
                    <>
                      {(data?.transfertct_sdl?.quantite_cerise_b_confirme / 1000).toLocaleString(
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
                      {data?.transfertct_sdl?.quantite_cerise_b_confirme?.toLocaleString("fr-FR") || 0}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}
                  {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" ? (
                    ""
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({data?.transfertct_sdl?.quantite_cerise_b_confirme?.toLocaleString("fr-FR")} kg)
                    </span>
                  )}

                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardDescription>
          <div className="p-4">
            <Separator />
            <CardTitle className="text-sm font-semibold tabular-nums text-muted-foreground my-2">
              CT source:
            </CardTitle>
            <div className="text-sm font-normal flex flex-wrap gap-2 ">
              {data?.transfert_get_ct?.map((item) => (
                <span key={item.id} className="text-xs bg-secondary/10 py-1 px-2 rounded-lg">
                  {item.ct__ct_nom}
                </span>
              ))}

            </div>
          </div>
        </CardDescription>

      </Card>
      <Card className="@container/card col-span-1 lg:col-span-4 ">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-secondary p-2 rounded-md">
              <ChartColumn className="text-white" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
              {(data?.rapportCTotal?.quantite_cafe_parche) >= 1000 ? (
                <>
                  {((data?.rapportCTotal?.quantite_cafe_parche) / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {(data?.rapportCTotal?.quantite_cafe_parche)?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-sm">Kg</span>
                </>
              )}
            </CardTitle>
            {user?.session?.category === "Cafe_Chef_societe" || user?.session?.category === "Superviseur_Regional" ? (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({(data?.rapportCTotal?.quantite_cafe_parche)?.toLocaleString("fr-FR")} kg)
              </span>
            ) : (
              <></>
            )}
          </div>
          <CardTitle className="text-sm font-semibold text-muted-foreground ">
            Rapport C
          </CardTitle>
          <Separator />
          { }
          <div className="grid grid-cols-1 gap-2 text-xs w-full">
            <div className="flex flex-col gap-1 py-1 px-4  border-b-2 border-b-primary/50">
              <div className="flex flex-row gap-x-1 items-center">
                <span className="text-primary flex items-center gap-1">●</span>
                <CardTitle className="text-base text-primary">
                  Fully Washed
                </CardTitle>
              </div>
              <CardDescription className="font-medium text-accent-foreground text-lg">
                <div className="text-xs grid grid-cols-2 gap-0.5">
                  {data?.rapportC?.filter((item) => item?.cafe_parche_type === "FULL_WASHED")?.map((item) => (
                    <span key={item.id} className="flex items-center gap-2">
                      <span>{item?.grade__grade_code}:</span>
                      <span>
                        {(item?.quantite_total) >= 1000 ? (
                          <>
                            {((item?.quantite_total) / 1000).toLocaleString("fr-FR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            <span>T</span>
                          </>
                        ) : (
                          <>
                            {(item?.quantite_total)?.toLocaleString("fr-FR") || 0}{" "}
                            <span>Kg</span>
                          </>
                        )}
                      </span>
                    </span>
                  ))}

                </div>

              </CardDescription>
            </div>
            <div className="flex flex-col gap-1 py-1 px-4  border-b-2 border-b-primary/50">
              <div className="flex flex-row gap-x-1 items-center">
                <span className="text-primary flex items-center gap-1">●</span>
                <CardTitle className="text-base text-primary">
                  Miel
                </CardTitle>
              </div>
              <CardDescription className="font-medium text-accent-foreground text-lg">
                <div className="text-xs grid grid-cols-2 gap-0.5">
                  {data?.rapportC?.filter((item) => item?.cafe_parche_type === "MIEL")?.map((item) => (
                    <span key={item.id} className="flex items-center gap-2">
                      <span>{item?.grade__grade_code}:</span>
                      <span>
                        {(item?.quantite_total) >= 1000 ? (
                          <>
                            {((item?.quantite_total) / 1000).toLocaleString("fr-FR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            <span>T</span>
                          </>
                        ) : (
                          <>
                            {(item?.quantite_total)?.toLocaleString("fr-FR") || 0}{" "}
                            <span>Kg</span>
                          </>
                        )}
                      </span>
                    </span>
                  ))}

                </div>

              </CardDescription>
            </div>
            <div className="flex flex-col gap-1 py-1 px-4  border-b-2 border-b-primary/50">
              <div className="flex flex-row gap-x-1 items-center">
                <span className="text-primary flex items-center gap-1">●</span>
                <CardTitle className="text-base text-primary">
                  Naturel
                </CardTitle>
              </div>
              <CardDescription className="font-medium text-accent-foreground text-lg">
                <div className="text-xs grid grid-cols-2 gap-0.5">
                  {data?.rapportC?.filter((item) => item?.cafe_parche_type === "NATUREL")?.map((item) => (
                    <span key={item.id} className="flex items-center gap-2">
                      <span>{item?.grade__grade_code}:</span>
                      <span>
                        {(item?.quantite_total) >= 1000 ? (
                          <>
                            {((item?.quantite_total) / 1000).toLocaleString("fr-FR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            <span>T</span>
                          </>
                        ) : (
                          <>
                            {(item?.quantite_total)?.toLocaleString("fr-FR") || 0}{" "}
                            <span>Kg</span>
                          </>
                        )}
                      </span>
                    </span>
                  ))}

                </div>

              </CardDescription>
            </div>
            {user?.session?.category === "Admin" || user?.session?.category === "Superviseur" ? (
              <div className="flex flex-col gap-1 py-1 px-4  border-b-2 border-b-primary/50">
                <div className="flex flex-row gap-x-1 items-center">
                  <span className="text-primary flex items-center gap-1">●</span>
                  <CardTitle className="text-base text-primary">
                    Non Classe
                  </CardTitle>
                </div>
                <CardDescription className="font-medium text-accent-foreground text-lg">
                  <div className="text-xs grid grid-cols-2 gap-0.5">
                    {data?.rapportC?.filter((item) => item?.cafe_parche_type === null)?.map((item) => (
                      <span key={item.id} className="flex items-center gap-2">
                        <span>{item?.grade__grade_code}:</span>
                        <span>
                          {(item?.quantite_total) >= 1000 ? (
                            <>
                              {((item?.quantite_total) / 1000).toLocaleString("fr-FR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                              <span>T</span>
                            </>
                          ) : (
                            <>
                              {(item?.quantite_total)?.toLocaleString("fr-FR") || 0}{" "}
                              <span>Kg</span>
                            </>
                          )}
                        </span>
                      </span>
                    ))}

                  </div>

                </CardDescription>
              </div>
            ) : ""}

          </div>
        </CardHeader>

      </Card>
      <Card className="@container/card col-span-1 lg:col-span-4 ">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-secondary p-2 rounded-md">
              <TruckElectric className="text-white" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
              {(data?.transfertUDPtotal?.quantite_cafe_parche) >= 1000 ? (
                <>
                  {((data?.transfertUDPtotal?.quantite_cafe_parche) / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {(data?.transfertUDPtotal?.quantite_cafe_parche)?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-sm">Kg</span>
                </>
              )}
            </CardTitle>
            {user?.session?.category === "Cafe_Chef_societe" || user?.session?.category === "Superviseur_Regional" ? (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({(data?.transfertUDPtotal?.quantite_cafe_parche)?.toLocaleString("fr-FR")} kg)
              </span>
            ) : (
              <></>
            )}
          </div>
          <CardTitle className="text-sm font-semibold tabular-nums text-muted-foreground ">
            Qte Transférée (UDP)
          </CardTitle>
          <Separator />
          <div className="grid grid-cols-1 gap-2 text-xs w-full">
            <div className="flex flex-col gap-1 py-1 px-4  border-b-2 border-b-primary/50">
              <div className="flex flex-row gap-x-1 items-center">
                <span className="text-primary flex items-center gap-1">●</span>
                <CardTitle className="text-base text-primary">
                  Fully Washed
                </CardTitle>
              </div>
              <CardDescription className="font-medium text-accent-foreground text-lg">
                <div className="text-xs grid grid-cols-2 gap-0.5">
                  {data?.transfertUDPDetails?.filter((item) => item?.cafe_parche_type === "FULL_WASHED")?.map((item) => (
                    <span className="flex items-center gap-2">
                      <span>{item?.grade__grade_code}:</span>
                      <span>
                        {(item?.quantite_total) >= 1000 ? (
                          <>
                            {((item?.quantite_total) / 1000).toLocaleString("fr-FR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            <span>T</span>
                          </>
                        ) : (
                          <>
                            {(item?.quantite_total)?.toLocaleString("fr-FR") || 0}{" "}
                            <span>Kg</span>
                          </>
                        )}
                      </span>
                    </span>
                  ))}
                </div>

              </CardDescription>
            </div>
            <div className="flex flex-col gap-1 py-1 px-4  border-b-2 border-b-primary/50">
              <div className="flex flex-row gap-x-1 items-center">
                <span className="text-primary flex items-center gap-1">●</span>
                <CardTitle className="text-base text-primary">
                  Miel
                </CardTitle>
              </div>
              <CardDescription className="font-medium text-accent-foreground text-lg">
                <div className="text-xs grid grid-cols-2 gap-0.5">
                  {data?.transfertUDPDetails?.filter((item) => item?.cafe_parche_type === "MIEL")?.map((item) => (
                    <span className="flex items-center gap-2">
                      <span>{item?.grade__grade_code}:</span>
                      <span>
                        {(item?.quantite_total) >= 1000 ? (
                          <>
                            {((item?.quantite_total) / 1000).toLocaleString("fr-FR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            <span>T</span>
                          </>
                        ) : (
                          <>
                            {(item?.quantite_total)?.toLocaleString("fr-FR") || 0}{" "}
                            <span>Kg</span>
                          </>
                        )}
                      </span>
                    </span>
                  ))}
                </div>

              </CardDescription>
            </div>
            <div className="flex flex-col gap-1 py-1 px-4  border-b-2 border-b-primary/50">
              <div className="flex flex-row gap-x-1 items-center">
                <span className="text-primary flex items-center gap-1">●</span>
                <CardTitle className="text-base text-primary">
                  Naturel
                </CardTitle>
              </div>
              <CardDescription className="font-medium text-accent-foreground text-lg">
                <div className="text-xs grid grid-cols-2 gap-0.5">
                  {data?.transfertUDPDetails?.filter((item) => item?.cafe_parche_type === "NATUREL")?.map((item) => (
                    <span className="flex items-center gap-2">
                      <span>{item?.grade__grade_code}:</span>
                      <span>
                        {(item?.quantite_total) >= 1000 ? (
                          <>
                            {((item?.quantite_total) / 1000).toLocaleString("fr-FR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            <span>T</span>
                          </>
                        ) : (
                          <>
                            {(item?.quantite_total)?.toLocaleString("fr-FR") || 0}{" "}
                            <span>Kg</span>
                          </>
                        )}
                      </span>
                    </span>
                  ))}
                </div>

              </CardDescription>
            </div>
            {user?.session?.category === "Admin" || user?.session?.category === "Superviseur" ? (
              <div className="flex flex-col gap-1 py-1 px-4  border-b-2 border-b-primary/50">
                <div className="flex flex-row gap-x-1 items-center">
                  <span className="text-primary flex items-center gap-1">●</span>
                  <CardTitle className="text-base text-primary">
                    Non Classe
                  </CardTitle>
                </div>
                <CardDescription className="font-medium text-accent-foreground text-lg">
                  <div className="text-xs grid grid-cols-2 gap-0.5">
                    {data?.transfertUDPDetails?.filter((item) => item?.cafe_parche_type === null)?.map((item) => (
                      <span className="flex items-center gap-2">
                        <span>{item?.grade__grade_code}:</span>
                        <span>
                          {(item?.quantite_total) >= 1000 ? (
                            <>
                              {((item?.quantite_total) / 1000).toLocaleString("fr-FR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                              <span>T</span>
                            </>
                          ) : (
                            <>
                              {(item?.quantite_total)?.toLocaleString("fr-FR") || 0}{" "}
                              <span>Kg</span>
                            </>
                          )}
                        </span>
                      </span>
                    ))}
                  </div>

                </CardDescription>
              </div>

            ) : ""}
          </div>
        </CardHeader>

      </Card>
      <Card className="@container/card col-span-1 lg:col-span-13 relative flex flex-col gap-y-5">
        <CardHeader className="flex flex-col">
          <CardTitle className="text-lg font-medium tabular-nums  ">
            Qtes globales (SDL+CT)
          </CardTitle>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Archive className="text-white size-5" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
              {(qte_cerise_totale) >= 1000 ? (
                <>
                  {(qte_cerise_totale / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {(qte_cerise_totale)?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-sm">Kg</span>
                </>
              )}
            </CardTitle>
            {user?.session?.category === "Cafe_Chef_societe" || user?.session?.category === "Superviseur_Regional" ? (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({qte_cerise_totale?.toLocaleString("fr-FR")} kg)
              </span>
            ) : (
              <></>
            )}
          </div>


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
                style={{ width: `${percentage_a_totale}%` }}
              />
              <div
                className="bg-secondary/90"
                style={{ width: `${percentage_b_totale}%` }}
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
                  {qte_cerise_a_totale >= 1000 ? (
                    <>
                      {(qte_cerise_a_totale / 1000).toLocaleString(
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
                      {qte_cerise_a_totale?.toLocaleString("fr-FR") || 0}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}

                  {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" ? (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({percentage_a_totale?.toFixed(1)}%)
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({qte_cerise_a_totale?.toLocaleString("fr-FR")} kg)
                    </span>
                  )}

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
                  {qte_cerise_b_totale >= 1000 ? (
                    <>
                      {(qte_cerise_b_totale / 1000).toLocaleString(
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
                      {qte_cerise_b_totale?.toLocaleString("fr-FR") || 0}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}
                  {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" ? (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({percentage_b_totale?.toFixed(1)}%)
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({qte_cerise_b_totale?.toLocaleString("fr-FR")} kg)
                    </span>
                  )}

                </CardDescription>
              </div>
            </div>
          </div>

        </CardHeader>
        <CardHeader className="flex flex-col">
          <CardTitle className="text-lg font-medium tabular-nums  ">
            Parche disponible
          </CardTitle>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-secondary p-2 rounded-md">
              <Grape className="text-white size-4" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
              {(qte_parche_disponible) >= 1000 ? (
                <>
                  {((qte_parche_disponible) / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {(qte_parche_disponible)?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-sm">Kg</span>
                </>
              )}
            </CardTitle>
            {user?.session?.category === "Cafe_Chef_societe" || user?.session?.category === "Superviseur_Regional" ? (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({(qte_parche_disponible)?.toLocaleString("fr-FR")} kg)
              </span>
            ) : (
              <></>
            )}
          </div>

          <Separator />
          {/* <div className="grid grid-cols-1 gap-2 text-xs w-full">
            <div className="flex flex-col gap-1 py-1 px-4  border-b-2 border-b-primary/50">
              <div className="flex flex-row gap-x-1 items-center">
                <span className="text-primary flex items-center gap-1">●</span>
                <CardTitle className="text-base text-primary">
                  Fully Washed
                </CardTitle>
              </div>
              <CardDescription className="font-medium text-accent-foreground text-lg">
                <div className="text-xs grid grid-cols-2 gap-0.5">
                  <span className="flex items-center gap-2">
                    <span>A1:</span>
                    <span>
                      {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) >= 1000 ? (
                        <>
                          {((data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) / 1000).toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          <span>T</span>
                        </>
                      ) : (
                        <>
                          {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b)?.toLocaleString("fr-FR") || 0}{" "}
                          <span>Kg</span>
                        </>
                      )}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span>A2:</span>
                    <span>
                      {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) >= 1000 ? (
                        <>
                          {((data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) / 1000).toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          <span>T</span>
                        </>
                      ) : (
                        <>
                          {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b)?.toLocaleString("fr-FR") || 0}{" "}
                          <span>Kg</span>
                        </>
                      )}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span>A3:</span>
                    <span>
                      {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) >= 1000 ? (
                        <>
                          {((data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) / 1000).toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          <span>T</span>
                        </>
                      ) : (
                        <>
                          {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b)?.toLocaleString("fr-FR") || 0}{" "}
                          <span>Kg</span>
                        </>
                      )}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span>A4:</span>
                    <span>
                      {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) >= 1000 ? (
                        <>
                          {((data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) / 1000).toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          <span>T</span>
                        </>
                      ) : (
                        <>
                          {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b)?.toLocaleString("fr-FR") || 0}{" "}
                          <span>Kg</span>
                        </>
                      )}
                    </span>
                  </span>
                </div>

              </CardDescription>
            </div>
            <div className="flex flex-col gap-1 py-1 px-4 border-b-2 border-b-primary/50">
              <div className="flex flex-row gap-x-1 items-center">
                <span className="text-primary flex items-center gap-1">●</span>
                <CardTitle className="text-base text-primary">
                  Naturel
                </CardTitle>
              </div>
              <CardDescription className="font-medium text-accent-foreground text-lg">
                <div className="text-xs grid grid-cols-2">
                  <span className="flex items-center gap-2">
                    <span>Coque:</span>
                    <span>
                      {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) >= 1000 ? (
                        <>
                          {((data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) / 1000).toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          <span>T</span>
                        </>
                      ) : (
                        <>
                          {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b)?.toLocaleString("fr-FR") || 0}{" "}
                          <span>Kg</span>
                        </>
                      )}
                    </span>
                  </span>
                </div>

              </CardDescription>
            </div>
            <div className="flex flex-col gap-1 py-1 px-4">
              <div className="flex flex-row gap-x-1 items-center">
                <span className="text-primary flex items-center gap-1">●</span>
                <CardTitle className="text-base text-primary">
                  Miel
                </CardTitle>
              </div>
              <CardDescription className="font-medium text-accent-foreground text-lg">
                <div className="text-xs grid grid-cols-2">
                  <span className="flex items-center gap-2">
                    <span>A1:</span>
                    <span>
                      {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) >= 1000 ? (
                        <>
                          {((data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) / 1000).toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          <span>T</span>
                        </>
                      ) : (
                        <>
                          {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b)?.toLocaleString("fr-FR") || 0}{" "}
                          <span>Kg</span>
                        </>
                      )}
                    </span>
                  </span>
                </div>
              </CardDescription>
            </div>
          </div> */}
        </CardHeader>
      </Card>
    </div>
  );
}

export default StatsCard;
