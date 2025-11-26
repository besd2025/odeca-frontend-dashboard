"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, User, Grape } from "lucide-react";

export function SummaryCards() {
  const totalCultivators = 2230;
  const menCount = 1250;
  const womenCount = 980;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Users className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums ml-2">
              60 194,59
            </CardTitle>
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums ml-2">
            Total Cafeiculteurs
          </CardTitle>
          {/* <CardAction>
            <Badge variant="secondary">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction> */}
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className=" font-medium">Hommes</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{menCount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {((menCount / totalCultivators) * 100).toFixed(1)}% du total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className="font-medium">Femmes</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {womenCount.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {((womenCount / totalCultivators) * 100).toFixed(1)}% du total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
