import React, { useEffect } from "react";
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
} from "lucide-react";
import { fetchData } from "@/app/_utils/api";

function StatsCard({ cult_id }) {
  const [data, setData] = React.useState({});
  const [values, setValues] = React.useState({});
  useEffect(() => {
    const getCultivators = async () => {
      try {
        const response = await fetchData("get", `/cultivators/${cult_id}/`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });
        const valuesdata = await fetchData(
          "get",
          `/cultivators/${cult_id}/get_cafe_cafeiculteur_quantite_montant/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        setData(response);
        setValues(valuesdata);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };

    getCultivators();
  }, [cult_id]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Archive className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
              {values?.montant_cerise_a + values?.montant_cerise_b >= 1000 ? (
                <>
                  {(
                    values?.montant_cerise_a +
                    values?.montant_cerise_b / 1000
                  ).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {(
                    values?.montant_cerise_a + values?.montant_cerise_b
                  )?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-base">Kg</span>
                </>
              )}{" "}
            </CardTitle>
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums  ">
            Qte Vendue (CA+CB)
          </CardTitle>
          {/* <CardAction>
            <Badge variant="secondary">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction> */}
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
                {values?.montant_cerise_a >= 1000 ? (
                  <>
                    {(values?.montant_cerise_a / 1000).toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    <span className="text-sm">T</span>
                  </>
                ) : (
                  <>
                    {values?.montant_cerise_a?.toLocaleString("fr-FR") || 0}{" "}
                    <span className="text-sm">Kg</span>
                  </>
                )}{" "}
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
                {values?.montant_cerise_b >= 1000 ? (
                  <>
                    {(values?.montant_cerise_b / 1000).toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    <span className="text-sm">T</span>
                  </>
                ) : (
                  <>
                    {values?.montant_cerise_b?.toLocaleString("fr-FR") || 0}{" "}
                    <span className="text-sm">Kg</span>
                  </>
                )}{" "}
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
            {(values?.montant_cerise_a + values?.montant_cerise_b ?? 0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
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
            <div className="bg-yellow-500 p-2 rounded-md">
              <Landmark className="text-white" />
            </div>
            <CardTitle className="text-lg text-muted-foreground font-medium tabular-nums  ">
              {data?.cultivator_payment_type}
            </CardTitle>
          </div>
          {data?.cultivator_payment_type === "momo" ? (
            <>
              <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
                {data?.cultivator_payment_type}
              </CardTitle>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-col ">
                  <div className="text-muted-foreground font-medium tabular-nums  ">
                    No compte
                  </div>
                  <div className="text-lg font-semibold tracking-tight tabular-nums">
                    {data?.cultivator_mobile_payment_account}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-muted-foreground font-medium tabular-nums  ">
                    Proprietaire
                  </div>
                  <div className=" font-semibold tracking-tight tabular-nums">
                    {data?.cultivator_account_owner}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
                {data?.cultivator_bank_name}
              </CardTitle>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-col ">
                  <div className="text-muted-foreground font-medium tabular-nums  ">
                    No compte
                  </div>
                  <div className="text-lg font-semibold tracking-tight tabular-nums">
                    {data?.cultivator_bank_account}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-muted-foreground font-medium tabular-nums  ">
                    Proprietaire
                  </div>
                  <div className=" font-semibold tracking-tight tabular-nums">
                    {data?.cultivator_account_owner}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}

export default StatsCard;
