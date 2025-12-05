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
function StatsCard({ id }) {
  const [data, setData] = React.useState([]);
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
          }
        );

        const nombre_cultivateurs = await fetchData(
          "get",
          `cafe/stationslavage/${id}/get_total_cultivators_sdl/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );

        const response = { qte_achete, nombre_cultivateurs };
        console.log("::::", response);
        setData(response);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };

    getSdls();
  }, [id]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Archive className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
              {data?.qte_achete?.montant_cerise_a +
                data?.qte_achete?.montant_cerise_b}{" "}
              <span className="text-base">Kg</span>
            </CardTitle>
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums  ">
            Qte Colectee
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex flex-row items-center justify-between text-sm ">
          {/* <div className="text-muted-foreground">Qte totale (CA+CB)</div> */}
          <div className="ml-2 flex flex-col gap-y-1">
            <div className="flex flex-row gap-x-2 items-center bg-primary/10 py-1 px-2 rounded-lg w-max">
              <div className="flex flex-row gap-x-1 items-center">
                <Grape className="text-primary size-5" />
                <CardTitle className="text-md font-semibold text-primary">
                  Cerise A :
                </CardTitle>
              </div>
              <CardDescription className="font-semibold text-accent-foreground text-lg">
                {data?.qte_achete?.montant_cerise_a}
                <span className="text-sm">T</span>
              </CardDescription>
            </div>
            <div className="flex flex-row gap-x-2 items-center bg-secondary/10 py-1 px-2 rounded-lg">
              <div className="flex flex-row gap-x-1 items-center">
                <Grape className="text-secondary size-5" />
                <CardTitle className="text-md font-semibold text-secondary">
                  Cerise B :
                </CardTitle>
              </div>
              <CardDescription className="font-semibold text-accent-foreground text-lg">
                {data?.qte_achete?.montant_cerise_b}
                <span className="text-sm">T</span>
              </CardDescription>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-yellow-500 p-2 rounded-md">
              <CircleDollarSign className="text-white" />
            </div>
            <CardTitle className="text-lg text-muted-foreground font-medium tabular-nums  ">
              Montant
            </CardTitle>
          </div>
          <CardTitle className="text-3xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
            {data?.qte_achete?.montant_cerise_a +
              data?.qte_achete?.montant_cerise_b}{" "}
            <span className="text-base">FBU</span>
          </CardTitle>
          <div className="mt-3">
            <div className="flex flex-row gap-x-2 items-center">
              <Banknote className="text-secondary" />

              <CardTitle className="text-muted-foreground font-medium tabular-nums  ">
                Tranche 1
              </CardTitle>
            </div>
            <CardTitle className="text-lg font-semibold tracking-tight tabular-nums">
              0 <span className="text-base">FBU</span>
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-secondary p-2 rounded-full">
              <Users className="text-white" />
            </div>
            <CardTitle className="text-lg text-muted-foreground font-medium tabular-nums  ">
              Cafeiculteurs
            </CardTitle>
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
            {(data?.nombre_cultivateurs?.hommes ?? 0) +
              (data?.nombre_cultivateurs?.femmes ?? 0)}
          </CardTitle>
          <div className="flex flex-row gap-x-4 mt-4">
            <div className="flex flex-col ">
              <div className="text-muted-foreground font-medium tabular-nums flex gap-x-1 ">
                <span>
                  <Mars />
                </span>
                Homme
              </div>
              <div className="text-lg font-semibold tracking-tight tabular-nums ml-4">
                {data?.nombre_cultivateurs?.hommes}
              </div>
            </div>
            <div className="flex flex-col ">
              <div className="text-muted-foreground font-medium tabular-nums flex gap-x-1 ">
                <span>
                  <Venus />
                </span>
                Femme
              </div>
              <div className="text-lg font-semibold tracking-tight tabular-nums ml-4">
                {data?.nombre_cultivateurs?.femmes}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default StatsCard;
