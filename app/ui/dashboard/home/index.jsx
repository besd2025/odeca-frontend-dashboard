import React from "react";
import { SectionCards } from "./cards-sections";
import { ChartPieSdlCtActive } from "./charts/sdl-ct-active";
import { ChartLineAchats } from "./charts/sdl-ct-achats";
import { StockSummaryCard } from "./stock-card";
import { KPIGrid } from "./kpi-stats";
import { RecentTransactions } from "./recent-transactions";
import { TopPerformers } from "./top-performers";

function DashboardContainer() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />

          {/* New KPI Grid Section */}
          <div className="px-4 lg:px-6">
            <KPIGrid />
          </div>

          <div className="px-4 lg:px-6 grid grid-cols-5 gap-4">
            {/* Existing Charts + Stock Card */}
            <div className="col-span-5 md:col-span-2 flex flex-col gap-4">
              <StockSummaryCard />
              <ChartPieSdlCtActive />
            </div>
            <div className="col-span-5 md:col-span-3">
              <ChartLineAchats />
            </div>
          </div>

          {/* New Bottom Section: Transactions & Top Performers */}
          <div className="px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <RecentTransactions />
            </div>
            <div className="lg:col-span-1">
              <TopPerformers />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardContainer;
