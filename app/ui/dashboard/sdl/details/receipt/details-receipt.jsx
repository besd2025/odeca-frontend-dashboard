import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Grape, ReceiptText, Spline } from "lucide-react";

export default function DetailsReceipt({ data }) {
  console.log("data", data);
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
          <DialogTitle>Details de Reception</DialogTitle>
          <div className="mt-2 flex flex-col gap-y-2">
            <div className="flex items-center justify-between text-lg ">
              <span className="text-muted-foreground">Source</span>
              <span className="font-medium">{data?.from_sdl}</span>
            </div>
            <div className="#CA border rounded p-2">
              <h1 className="flex gap-x-2 bg-primary w-max items-center py-1 px-2 rounded-lg text-primary-foreground">
                <Grape size={20} />
                Cerise A
              </h1>
              <div className="mt-2 flex flex-col gap-y-2">
                <div className="flex items-center justify-between text-sm ">
                  <span className="text-muted-foreground">Quantite</span>
                  <span className="font-medium">{data?.qte_tranferer?.ca}</span>
                </div>
              </div>
            </div>
            <div className="#CA border rounded p-2">
              <h1 className="flex gap-x-2 bg-secondary w-max items-center py-1 px-2 rounded-lg text-primary-foreground">
                <Grape size={20} />
                Cerise B
              </h1>
              <div className="mt-2 flex flex-col gap-y-2">
                <div className="flex items-center justify-between text-sm ">
                  <span className="text-muted-foreground">Quantite</span>
                  <span className="font-medium">{data?.qte_tranferer?.cb}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-lg ">
              <span className="text-muted-foreground">Qte total:</span>
              <span className="font-medium">{data?.qte_tranferer?.ca + data?.qte_tranferer?.cb}</span>
            </div>
            <div className="flex items-center justify-between text-sm ">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{new Date(data?.date_transfert).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
