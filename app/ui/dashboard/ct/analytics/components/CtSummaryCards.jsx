"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, CheckCircle2, XCircle } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
export function CtSummaryCards() {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const getCts = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/centres_transite/get_active_and_non_active_ct/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );

        setData(response);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };

    getCts();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Factory className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums ml-2">
              {data?.total_ct}
            </CardTitle>
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums ml-2">
            Effectif Total des CTs
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className=" font-medium">Actifs</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.achat_cafes_ct?.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {((data?.achat_cafes_ct / data?.total_ct) * 100)?.toFixed(1)}% du
            total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className="font-medium">Inactifs</CardTitle>
          <XCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.inactive_ct?.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {((data?.inactive_ct / data?.total_ct) * 100)?.toFixed(1)}% du total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
