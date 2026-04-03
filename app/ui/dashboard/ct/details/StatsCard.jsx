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
  CircleDollarSign,
  Grape,
  Landmark,
  Mars,
  Users,
  Venus,
} from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { SimpleCardSkeleton } from "@/components/ui/skeletons";
import { Separator } from "@/components/ui/separator";
function StatsCard({ id }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getSdls = async () => {
      try {
        const qte_achete = await fetchData(
          "get",
          `cafe/centres_transite/${id}/get_total_achat_par_ct/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const nombre_cultivateurs = await fetchData(
          "get",
          `cafe/centres_transite/${id}/get_total_cultivators_ct/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const response = { qte_achete, nombre_cultivateurs };
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
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
      <Card className="@container/card col-span-1 lg:col-span-5 relative">
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
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    ({percentageB.toFixed(1)}%)
                  </span>
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
            <CardTitle className="text-lg text-muted-foreground font-medium tabular-nums  ">
              Montant
            </CardTitle>
          </div>
          <CardTitle className="text-3xl @[250px]/card:text-2xl font-semibold tracking-tight tabular-nums">
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
            <div className="flex flex-row gap-x-4 items-center">
              <div className="flex flex-row gap-x-1 items-center">
                <Banknote className="text-secondary" />

                <CardTitle className="text-muted-foreground font-normal text-sm  ">
                  Tranche 1
                </CardTitle>
              </div>
              <CardTitle className="text-md font-semibold tracking-tight tabular-nums">
                0 <span className="text-base">FBU</span>
              </CardTitle>
            </div>
            <Separator />
            <div className="flex flex-row gap-x-4 items-center">
              <div className="flex flex-row gap-x-1 items-center">
                <Banknote className="text-secondary" />

                <CardTitle className="text-muted-foreground font-normal text-sm  ">
                  Tranche 2
                </CardTitle>
              </div>
              <CardTitle className="text-md font-semibold tracking-tight tabular-nums">
                0 <span className="text-base">FBU</span>
              </CardTitle>
            </div>
            <Separator />
            <div className="flex flex-row gap-x-4 items-center">
              <div className="flex flex-row gap-x-1 items-center">
                <Banknote className="text-secondary" />

                <CardTitle className="text-muted-foreground font-normal text-sm  ">
                  Avance
                </CardTitle>
              </div>
              <CardTitle className="text-md font-semibold tracking-tight tabular-nums">
                0 <span className="text-base">FBU</span>
              </CardTitle>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card col-span-2 p-2">
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
          <div className="flex flex-col gap-y-2 mt-4 rounded-md  p-2">
            <div className="flex flex-row ">
              <div className="text-muted-foreground flex gap-x-1 ">
                <span className="bg-background p-1 rounded">
                  <Mars />
                </span>
                Homme :
              </div>
              <div className="font-medium  ml-4">
                {data?.nombre_cultivateurs?.hommes}
              </div>
            </div>
            <div className="flex flex-row ">
              <div className="text-muted-foreground flex gap-x-1">
                <span className="bg-background p-1 rounded">
                  <Venus />
                </span>
                Femme :
              </div>
              <div className="font-medium  ml-4">
                {data?.nombre_cultivateurs?.femmes || 0}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default StatsCard;
