import { ChartAreaInteractive } from "@/app/ui/dashboard/usine/dashboard/chart-area-interactive"

import data from "@/app/ui/dashboard/usine/analytics/data.json"
import { SectionCards } from "./section-cards";
import QualiteProduit from "./qualite-produit";
import { DataTable } from "./data-table";

export default function CardsSectionUsines({ usineId } = {}) {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex  flex-col gap-2">
                <div className="flex flex-col gap-4 md:gap-6 md:py-2">
                    <SectionCards usineId={usineId} />
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* <ChartAreaInteractive /> */}
                        <QualiteProduit />
                        <DataTable data={data} />
                    </div>

                </div>
            </div>
        </div>
    )
}