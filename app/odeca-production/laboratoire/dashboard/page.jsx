import { LabSectionCards } from "@/app/ui/production/laboratoire/dashboard/section-cards";
import QualitesTaxationTable from "@/app/ui/production/laboratoire/dashboard/cupping-table";
import UsinesEchantillonnageTable from "@/app/ui/production/laboratoire/dashboard/granulometrie-table";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <LabSectionCards />
          <div className="px-4 lg:px-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <QualitesTaxationTable />
            <UsinesEchantillonnageTable />
          </div>
        </div>
      </div>
    </div>
  );
}
