import { ChartAreaInteractive } from "@/app/ui/production/usine/dashboard/chart-area-interactive"
import { DataTable } from "@/app/ui/production/usine/dashboard/data-table"
import { SectionCards } from "@/app/ui/production/usine/dashboard/section-cards"

import data from "./data.json"
import QualiteProduit from "@/app/ui/production/usine/dashboard/qualite-produit";

export default function Page() {
  return (

    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* <ChartAreaInteractive /> */}
            <QualiteProduit />
            <DataTable data={data} />
          </div>

        </div>
      </div>
    </div>
  );
}
