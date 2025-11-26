"use client";

import React from "react";
import { SummaryCards } from "./components/SummaryCards";
import { GenreChart } from "./components/GenreChart";
import { RegistrationChart } from "./components/RegistrationChart";
import { LocationChart } from "./components/LocationChart";
import { AgeChart } from "./components/AgeChart";
import { TopFiveCards } from "./components/TopFiveCards";
import { PaymentChart } from "./components/PaymentChart";

export default function CultivatorAnalytics() {
  return (
    <div className="lg:p-4 space-y-6 bg-muted/10 min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Analytiques des Cultivateurs
        </h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des données démographiques et de production.
        </p>
      </div>

      {/* Top Cards */}
      <SummaryCards />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Radial Chart: Genre */}
        <GenreChart />

        {/* Line Chart: Enregistrements */}
        <RegistrationChart />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Bar Chart: Location */}
        <LocationChart />

        {/* Bar Chart: Age Pyramid */}
        <AgeChart />
      </div>

      {/* Top 5 Cards */}
      <TopFiveCards />

      {/* Radial Chart: Payment Mode */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <PaymentChart />
      </div>
    </div>
  );
}
