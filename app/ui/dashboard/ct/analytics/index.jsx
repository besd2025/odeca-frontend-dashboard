"use client";

import React from "react";
import { CtSummaryCards } from "./components/CtSummaryCards";
import { CtActiveChart } from "./components/CtActiveChart";
import { CtLocationChart } from "./components/CtLocationChart";
import { CtTypeChart } from "./components/CtTypeChart";
import { CtTopFiveCards } from "./components/CtTopFiveCards";

export default function CtAnalytics() {
  return (
    <div className="lg:p-4 space-y-6 bg-muted/10 min-h-screen">
      {/* Top Cards */}
      <CtSummaryCards />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Pie Chart: Active vs Non-Active */}
        <CtActiveChart />

        {/* Pie Chart: Private vs Public */}
        <CtTypeChart />

        {/* Bar Chart: Location */}
        <div className="col-span-1 lg:col-span-3">
          <CtLocationChart />
        </div>
      </div>

      {/* Top 5 Cards */}
      <CtTopFiveCards />
    </div>
  );
}
