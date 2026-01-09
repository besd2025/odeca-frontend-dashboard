"use client";

import React from "react";
import { SdlSummaryCards } from "./components/SdlSummaryCards";
import { SdlActiveChart } from "./components/SdlActiveChart";
import { SdlLocationChart } from "./components/SdlLocationChart";
import { SdlTypeChart } from "./components/SdlTypeChart";
import { SdlTopFiveCards } from "./components/SdlTopFiveCards";

export default function SdlAnalytics() {
  return (
    <div className="lg:p-4 space-y-6 bg-muted/10 min-h-screen">
      {/* Top Cards */}
      <SdlSummaryCards />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Pie Chart: Active vs Non-Active */}
        <SdlActiveChart />

        {/* Pie Chart: Private vs Public */}
        <SdlTypeChart />

        <div className="col-span-1 lg:col-span-3">
          <SdlLocationChart />
        </div>
      </div>

      {/* Top 5 Cards */}
      <SdlTopFiveCards />
    </div>
  );
}
