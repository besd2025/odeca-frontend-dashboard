import React from "react";
import { SectionCards } from "./cards-sections";
import { ChartPieSdlCtActive } from "./charts/sdl-ct-active";
import { ChartLineAchats } from "./charts/sdl-ct-achats";

function DashboardContainer() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6 grid grid-cols-5 gap-4">
            <div className="col-span-5 md:col-span-2">
              <ChartPieSdlCtActive />
            </div>
            <div className="col-span-5 md:col-span-3">
              <ChartLineAchats />
            </div>
          </div>
          {/* <DataTable data={data} /> */}
        </div>
      </div>
    </div>
  );
}

export default DashboardContainer;
