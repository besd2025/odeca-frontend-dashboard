"use client";

import React from "react";
import { UsineSummaryCards } from "./components/UsineSummaryCards";
import { UsineActiveChart } from "./components/UsineActiveChart";
import { UsineLocationChart } from "./components/UsineLocationChart";
import { UsineTypeChart } from "./components/UsineTypeChart";
import { TopFiveCards } from "./components/UsineTopFiveCards";

export default function SdlAnalytics() {
  return (
    <div className="lg:p-4 space-y-6 bg-muted/10 min-h-screen">
      {/* Top Cards */}
      <UsineSummaryCards />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Pie Chart: Active vs Non-Active */}
        <UsineActiveChart />

        {/* Pie Chart: Private vs Public */}
        <UsineTypeChart />

        {/* Placeholder for layout balance or another chart if needed. 
            Since we have 7 cols, and 2 charts taking 2 cols each (total 4), 
            we have 3 cols left. Maybe SdlLocationChart can take 3 cols? 
            Or we can adjust the grid. 
            Cultivators had: GenreChart (2), RegistrationChart (line, probably 5?).
            Here we have 2 pies and 1 bar.
            Let's put the two pies side by side (2+2) and maybe the bar chart below or next to them.
            Let's try: Row 1: Active (3), Type (3). Row 2: Location (full width or half).
            
            Let's stick to the grid:
            Row 1: Active (2), Type (2), Location (3).
        */}
        <div className="col-span-1 lg:col-span-3">
          <UsineLocationChart />
        </div>
      </div>

      {/* Top 5 Cards */}
      <TopFiveCards />
    </div>
  );
}
