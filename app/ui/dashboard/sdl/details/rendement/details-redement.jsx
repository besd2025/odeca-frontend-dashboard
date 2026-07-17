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
import { fetchData } from "@/app/_utils/api";
import { useEffect } from "react";

export default function DetailsRendement({ data }) {
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

            <div className="#CA border rounded p-2">
              <h1 className="flex gap-x-2 bg-primary w-max items-center py-1 px-2 rounded-lg text-primary-foreground">
                <Grape size={20} />
                Grade: {data?.grade}
              </h1>
              <div className="mt-2 flex flex-col gap-y-2">
                <div className="flex items-center gap-x-4 text-sm ">
                  <span className="text-muted-foreground">Numero lot: {data?.lot_num} </span>

                </div>
                <div className="flex items-center gap-x-4 text-sm ">
                  <span className="text-muted-foreground">Qte total: {data?.QteParche} kg</span>

                </div>
                <div className="flex items-center gap-x-4 text-sm ">
                  <span className="font-medium">code rendement: {data?.rendement_code}</span>
                </div>
                <div className="flex items-center gap-x-4 text-sm ">
                  <span className="text-muted-foreground">Date :{data?.date} kg</span>
                </div>
              </div>
            </div>

          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
