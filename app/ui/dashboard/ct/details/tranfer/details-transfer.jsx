import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Layers2, MapPinHouse, ReceiptText, Spline } from "lucide-react";

export default function DetailsTransfer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-0">
          <ReceiptText />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Details du transfer</DialogTitle>
          <div className="mt-2 flex flex-col gap-y-2">
            <div className="flex items-center justify-between text-lg ">
              <span className="text-muted-foreground">Destination</span>
              <span className="font-medium">NGOMA</span>
            </div>
            <div className="#CA border rounded p-2">
              <h1 className="flex gap-x-2 bg-primary w-max items-center py-1 px-2 rounded-lg text-primary-foreground">
                <Spline size={20} />
                Cerise A
              </h1>
              <div className="mt-2 flex flex-col gap-y-2">
                <div className="flex items-center justify-between text-sm ">
                  <span className="text-muted-foreground">Grade A1</span>
                  <span className="font-medium">7.5 kg</span>
                </div>
                <div className="flex items-center justify-between text-sm ">
                  <span className="text-muted-foreground">Grade A2</span>
                  <span className="font-medium">7.5 kg</span>
                </div>
              </div>
            </div>
            <div className="#CA border rounded p-2">
              <h1 className="flex gap-x-2 bg-secondary w-max items-center py-1 px-2 rounded-lg text-primary-foreground">
                <Spline size={20} />
                Cerise B
              </h1>
              <div className="mt-2 flex flex-col gap-y-2">
                <div className="flex items-center justify-between text-sm ">
                  <span className="text-muted-foreground">Grade B1</span>
                  <span className="font-medium">7.5 kg</span>
                </div>
                <div className="flex items-center justify-between text-sm ">
                  <span className="text-muted-foreground">Grade B2</span>
                  <span className="font-medium">7.5 kg</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-lg ">
              <span className="text-muted-foreground">Qte total:</span>
              <span className="font-medium">7425.5 kg</span>
            </div>
            <div className="flex items-center justify-between text-sm ">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">7 jan 2025</span>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
