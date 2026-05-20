"use client"
import { SectionCards } from "./cards-sections";
import { ChartPieSdlCtActive } from "./charts/sdl-ct-active";
import { ChartLineAchats } from "./charts/sdl-ct-achats";
import { StockSummaryCard } from "./stock-card";
import { KPIGrid } from "./kpi-stats";
import { StockSummaryCardUDP } from "./stock-card-udp";
import { UserContext } from "@/app/ui/context/User_Context";
import React, { useContext } from "react";
import { SocietyTopFiveCards } from "./charts/SocietyTopFiveCards";
import { PaymentChart } from "../cultivators/analytics/components/PaymentChart";
import { UniqueAccountChart } from "../cultivators/analytics/components/UniqueAccountChart";
import PaymentStats from "../payments/payment-stats";
function DashboardContainer() {
  const user = useContext(UserContext)
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 ">
          <SectionCards />

          <div className="px-4 lg:px-6 grid grid-cols-5 gap-4">
            {/* Existing Charts + Stock Card */}
            <div className="col-span-5 lg:col-span-3 flex flex-col gap-4">
              <StockSummaryCard />
            </div>
            <div className="col-span-5 lg:col-span-2 flex flex-col gap-4">
              <ChartPieSdlCtActive />
            </div>
          </div>

          <div className="px-4 lg:px-6 grid grid-cols-5 gap-4">
            {/* New KPI Grid Section */}
            <div className="col-span-5 lg:col-span-1">
              <KPIGrid />
            </div>
            <div className="col-span-5 lg:col-span-4">
              <ChartLineAchats />
            </div>
          </div>
          <div className="px-4 lg:px-6 grid grid-cols-5 gap-4">
            {/* Existing Charts + Stock Card */}
            <div className="col-span-5 flex flex-col gap-4">
              <SocietyTopFiveCards />
            </div>
          </div>
          <div className="px-4 lg:px-6 grid grid-cols-3 gap-4">
            {/* Existing Charts + Stock Card */}
            <div className="col-span-1 flex flex-col gap-4">
              <PaymentChart />
            </div>
            <div className="col-span-1 flex flex-col gap-4">
              <UniqueAccountChart />
            </div>
            <div className="col-span-1 flex flex-col gap-4">
              <PaymentStats />
            </div>
          </div>
          {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" && (
            <div className="px-4 lg:px-6 grid grid-cols-5 gap-4">
              {/* Existing Charts + Stock Card */}
              <div className="col-span-5 flex flex-col gap-4">
                <StockSummaryCardUDP />
              </div>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}

export default DashboardContainer;
