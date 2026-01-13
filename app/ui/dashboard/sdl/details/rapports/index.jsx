import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RHlist from "./RH";
import { FileSpreadsheet } from "lucide-react";
import RBSdl from "./RB";
import RedementC from "../rendement";
const RHData = [
  {
    id: "cultivator_001",
    cultivator: {
      cultivator_code: "2530-522-7545",
      first_name: "Brave",
      last_name: "Eddy",
      image_url: "/images/logo_1.jpg",
    },
    cni: "74/565",
    ca: 78,
    ca_price: 7855,
    cb: 785,
    cb_price: 4544,
    qte_total: 555,
    total_price: 457,
  },
];
export default function Rapports() {
  const [rapports, setRapports] = useState("rapportB");
  return (
    <div>
      <Tabs
        value={rapports}
        className="space-y-6 w-full"
        onValueChange={setRapports}
      >
        {/* TABS LIST */}
        <TabsList className="overflow-x-auto flex-nowrap gap-2 w-full">
          <TabsTrigger value="rapportB" className="shrink-0">
            <FileSpreadsheet className="w-4 h-4" /> Rapport B
          </TabsTrigger>
          <TabsTrigger value="rapportC" className="shrink-0">
            <FileSpreadsheet className="w-4 h-4" /> Rapport C
          </TabsTrigger>
          <TabsTrigger value="rapportD" className="shrink-0">
            <FileSpreadsheet className="w-4 h-4" /> Rapport D
          </TabsTrigger>
          <TabsTrigger value="rapportG" className="shrink-0">
            <FileSpreadsheet className="w-4 h-4" /> Rapport G
          </TabsTrigger>
          <TabsTrigger value="rapportH" className="shrink-0">
            <FileSpreadsheet className="w-4 h-4" /> Rapport H
          </TabsTrigger>
        </TabsList>
        <TabsContent value="rapportB">
          <RBSdl />
        </TabsContent>
        <TabsContent value="rapportC">
          <RedementC />
        </TabsContent>
        <TabsContent value="rapportD">
          <h1 className="text-xl font-semibold m-2">Rapport D</h1>
        </TabsContent>
        <TabsContent value="rapportG">
          <h1 className="text-xl font-semibold m-2">Rapport G</h1>
        </TabsContent>
        <TabsContent value="rapportH">
          <h1 className="text-xl font-semibold m-2">Rapport H</h1>
          <RHlist data={RHData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
