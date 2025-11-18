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
} from "lucide-react";

function StatsCard({ icon: Icon, value, label }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Archive className="text-white" />
            </div>
            <CardTitle className="text-3xl @[250px]/card:text-4xl font-semibold tracking-tight tabular-nums">
              60 194,59 <span className="text-lg">T</span>
            </CardTitle>
          </div>
          <CardTitle className="text-xl font-semibold tabular-nums  ">
            Qte Vendue
          </CardTitle>
          {/* <CardAction>
            <Badge variant="secondary">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction> */}
        </CardHeader>
        <CardFooter className="flex flex-row items-center justify-between text-sm ">
          <div className="text-muted-foreground">Qte totale (CA+CB)</div>
          <div className="ml-2 flex flex-col gap-y-1">
            <div className="flex flex-row gap-x-2 items-center bg-primary/10 py-1 px-2 rounded-lg w-max">
              <div className="flex flex-row gap-x-1 items-center">
                <Grape className="text-primary size-5" />
                <CardTitle className="text-md font-semibold text-primary">
                  Cerise A :
                </CardTitle>
              </div>
              <CardDescription className="font-semibold text-accent-foreground text-lg">
                60 194,59 <span className="text-sm">T</span>
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
                20 194,59 <span className="text-sm">T</span>
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
            60 194 559 456 <span className="text-lg">FBU</span>
          </CardTitle>
          <div className="mt-3">
            <div className="flex flex-row gap-x-2 items-center">
              <Banknote className="text-secondary" />

              <CardTitle className="text-muted-foreground font-medium tabular-nums  ">
                Tranche 1
              </CardTitle>
            </div>
            <CardTitle className="text-lg font-semibold tracking-tight tabular-nums">
              559 456 <span className="text-lg">FBU</span>
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
              Bank
            </CardTitle>
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
            COOPEC / LUMICASH
          </CardTitle>
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col ">
              <div className="text-muted-foreground font-medium tabular-nums  ">
                No compte
              </div>
              <div className="text-lg font-semibold tracking-tight tabular-nums">
                559 456 / 68745125
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-muted-foreground font-medium tabular-nums  ">
                Proprietaire
              </div>
              <div className=" font-semibold tracking-tight tabular-nums">
                Ndayiragije Jean Vianey / Lui meme
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default StatsCard;
