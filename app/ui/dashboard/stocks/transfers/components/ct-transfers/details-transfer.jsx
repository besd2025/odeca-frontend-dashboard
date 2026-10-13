"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ReceiptText,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import ViewImageDialog from "@/components/ui/view-image-dialog";

export default function DetailsTransfer({ data, open: controlledOpen, onOpenChange: setControlledOpen, trigger }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  // Extraire les champs selon l'API
  const id = data?.id;
  const transferCode = data?.transfer_sdl_ct_code || data?.code || (id ? `#${id}` : "-");
  const ctSource = data?.from_ct || "-";
  const sdlDestination = data?.to_depulpeur_name || "-";
  const societe = data?.society || "-";
  const localite = data?.localite
    ? [data.localite.province, data.localite.commune].filter(Boolean).join(", ")
    : "-";

  const transferDate = data?.date || data?.transfer_date || "-";
  const enregitrementDate = data?.created_at || data?.enregitrement_date || "-";
  const confirmationDate = data?.confirmation_date || "-";

  const qteCa = data?.qte_tranferer?.ca ?? data?.quantite_cerise_a ?? 0;
  const qteCb = data?.qte_tranferer?.cb ?? data?.quantite_cerise_b ?? 0;
  const totalQte = (Number(qteCa) || 0) + (Number(qteCb) || 0);

  const isConfirmed = data?.status === true || data?.status === "CONFIRME";
  const photoFiche = data?.photo_fiche || null;

  const items = [
    {
      id: 1,
      quantiteCA: qteCa,
      quantiteCB: qteCb,
      status: isConfirmed,
    },
  ];

  const renderStatusBadge = (confirmed) => {
    if (confirmed) {
      return (
        <Badge variant="secondary" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Confirmé
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1">
        <Clock className="h-3 w-3" />
        En attente
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : !isControlled ? (
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-2 font-normal text-sm">
            <span>Détails</span>
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-[720px] bg-sidebar p-0 overflow-y-auto max-h-[90vh] flex flex-col">
        <DialogHeader className="p-5 pb-3 border-b bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                Détails du Transfert (CT → SDL)
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Informations sur le transfert effectué depuis le Centre de Transit
              </DialogDescription>
            </div>
            <div>{renderStatusBadge(isConfirmed)}</div>
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-3 mt-3 border-t border-border/50 text-sm">
            <div className="col-span-1 sm:col-span-3 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="font-medium text-foreground">Code Transfert :</span>
                <span className="font-mono font-semibold bg-muted px-1.5 py-0.5 rounded text-foreground">
                  {transferCode}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="font-medium text-foreground">CT Source :</span>
                <span className="truncate">{ctSource}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="font-medium text-foreground">SDL Destination :</span>
                <span className="truncate">{sdlDestination}</span>
              </div>
              {societe !== "-" && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Société :</span>
                  <span className="truncate">{societe}</span>
                </div>
              )}
              {localite !== "-" && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Localité :</span>
                  <span className="truncate">{localite}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="font-medium text-foreground">Date Transfert :</span>
                <span>{transferDate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="font-medium text-foreground">Date d&apos;Enregistrement :</span>
                <span>
                  {enregitrementDate !== "-" && !isNaN(Date.parse(enregitrementDate))
                    ? new Date(enregitrementDate).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : enregitrementDate}
                </span>
              </div>
              {isConfirmed && confirmationDate !== "-" && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="font-medium text-foreground">Date de Confirmation :</span>
                  <span>
                    {!isNaN(Date.parse(confirmationDate))
                      ? new Date(confirmationDate).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : confirmationDate}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="font-medium text-foreground">Total Cerises :</span>
                <span className="font-bold text-primary text-sm">
                  {totalQte.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} kg
                </span>
              </div>
            </div>

            <div>
              {photoFiche && photoFiche !== "null" && (
                <div className="p-3 flex items-center justify-between">
                  <div className="flex flex-col items-center gap-4">
                    <div>
                      <div className="text-xs font-semibold text-foreground">Fiche de Transfert</div>
                      <div className="text-[11px] text-muted-foreground">Cliquez sur l&apos;image pour l&apos;agrandir</div>
                    </div>
                    <ViewImageDialog
                      imageUrl={photoFiche}
                      alt="Fiche de transfert"
                      profile={false}
                      className="h-24 w-24 rounded-md border"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Corps du modal */}
        <div className="custom-scrollbar flex-1">
          {/* Section: Tableau liste des types de cerises */}
          <div className="space-y-2.5 p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                <Layers className="h-4 w-4 text-primary" />
                <span>Détail des Quantités Transférées</span>
              </div>
            </div>

            <div className="rounded-lg border bg-card overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold text-xs">CA</TableHead>
                    <TableHead className="font-semibold text-xs">CB</TableHead>
                    <TableHead className="font-semibold text-xs text-center">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-bold text-foreground text-sm">
                        {Number(item.quantiteCA || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} Kg
                      </TableCell>
                      <TableCell className="font-bold text-primary text-sm">
                        {Number(item.quantiteCB || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} Kg
                      </TableCell>
                      <TableCell className="text-center">
                        {renderStatusBadge(item.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
