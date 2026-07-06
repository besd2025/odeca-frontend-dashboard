import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Grape, Layers2, MapPinHouse, ReceiptText, Spline } from "lucide-react";

export default function DetailsRendement() {
  const data = [
    {
      id: 1,
      type: "FW",
      data: [
        { label: "A1", weight: 7.5 },
        { label: "A2", weight: 7.5 },
        { label: "A3", weight: 7.5 },
      ]

    },
    {
      id: 2,
      type: "NATUREL",
      data: [
        { label: "A1", weight: 7.5 },
        { label: "A2", weight: 7.5 },
        { label: "A3", weight: 7.5 },
      ]
    },
    {
      id: 3,
      type: "MIEL",
      data: [
        { label: "A1", weight: 7.5 },
        { label: "A2", weight: 7.5 },
        { label: "A3", weight: 7.5 },
      ],

    }
  ]
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className=" px-2 py-1.5 w-full  flex justify-start">
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rendement journalier</DialogTitle>
          <div className="mt-2 grid grid-cols-1 gap-2 ">
            {data.map((item) => (
              <div key={item.id} className="#CA border rounded p-2">
                <h1 className="flex gap-x-2 bg-primary w-max items-center py-1 px-2 rounded-lg text-primary-foreground">
                  <Grape size={20} />
                  {item.type}
                </h1>
                <div className="mt-2 flex flex-col gap-y-2">
                  {item.data.map((data) => (
                    <div className="flex items-center gap-x-4 text-sm ">
                      <span className="text-muted-foreground">{data.label}</span>
                      <span className="font-medium">{data.weight} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm ">
            <span>Date:</span>
            <span className="font-medium">7 jan 2025</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-lg ">
            <span>Qte total:</span>
            <span className="font-medium">7425.5 kg</span>
          </div>

        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
