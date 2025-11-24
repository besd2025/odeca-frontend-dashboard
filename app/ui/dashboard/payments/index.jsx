"use client";

import { useState } from "react";
import { FileText, BarChart3, ClipboardPlus, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Filter from "./filter";
import PaymentStats from "./payment-stats";
import Link from "next/link";

const recentFiles = [
  {
    name: "-1 ere tranche ",
    date: "12/05/2024",
    icon: FileText,
  },
  {
    name: "-2 ere tranche ",
    date: "12/05/2024",
    icon: FileText,
  },
];

const Listes = [
  {
    name: "1ere tranche collecte 2024",
    nbre_cafeiculteurs: "7844",
    intervalle: "01 Jan - 31 Mar 2024",
    date: "Apr 14, 2024",
  },
  {
    name: "1ere tranche collecte 2024",
    nbre_cafeiculteurs: "7844",
    intervalle: "01 Jan - 31 Mar 2024",
    date: "Apr 14, 2024",
  },
  {
    name: "1ere tranche collecte 2024",
    nbre_cafeiculteurs: "7844",
    intervalle: "01 Jan - 31 Mar 2024",
    date: "Apr 14, 2024",
  },
];

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isStoragePanelOpen, setIsStoragePanelOpen] = useState(false);

  return (
    <div className="bg-sidebar flex h-screen">
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-border flex h-16 items-center justify-between border-b px-4 lg:px-6">
          <div className="flex items-center gap-2 lg:gap-4">
            <Sheet
              open={isStoragePanelOpen}
              onOpenChange={setIsStoragePanelOpen}
            >
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6">
                <SheetHeader className="sr-only">
                  <SheetTitle>Statut des paiements</SheetTitle>
                  <SheetDescription>
                    Statistiques et répartition des paiements des cafeiculteurs.
                  </SheetDescription>
                </SheetHeader>
                <PaymentStats />
              </SheetContent>
            </Sheet>
            <Link href="/odeca-dashboard/payments/export-payment">
              <Button className="bg-primary " size="sm">
                <ClipboardPlus className="h-4 w-4 lg:mr-2" />
                <span className="hidden sm:inline">Exporter une liste</span>
              </Button>
            </Link>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            {/* All files header */}
            <div className="mb-6">
              <h1 className="mb-1 text-xl font-semibold lg:text-2xl">
                Paiement des cafeiculteurs
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Generation des listes de paiement des cafeiculteurs par periode
                de collecte.
              </p>
            </div>

            {/* Recently modified */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-medium lg:text-lg">
                  Liste des paiements recents
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentFiles.map((file, index) => (
                  <Card key={index} className="p-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                        <file.icon className="text-muted-foreground h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {file.name}
                        </p>
                        <p className="text-muted-foreground text-xs flex flex-row items-center">
                          <Link href="/odeca-dashboard/payments/view-list">
                            <Button variant="link" className="p-0 m-0 mr-1 ">
                              <Eye />
                              Consulter
                            </Button>
                          </Link>

                          <span className="block">{file.date}</span>
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* All files section */}
            <div className="bg-sidebar p-2  rounded-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-medium lg:text-lg">
                  Toutes les listes
                </h2>
                <div className="flex items-center gap-2">
                  <Filter />
                </div>
              </div>

              <div className="w-full border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Nbre de Cafeiculteurs</TableHead>
                      <TableHead>Intervalle</TableHead>
                      <TableHead>Date de sortie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Listes.map((list, index) => (
                      <TableRow
                        key={`${list.name}-${index}`}
                        className="odd:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {list.name}
                        </TableCell>
                        <TableCell>{list.nbre_cafeiculteurs}</TableCell>
                        <TableCell>{list.intervalle}</TableCell>
                        <TableCell>{list.date}</TableCell>
                        <TableCell className="sticky right-0 bg-background/50">
                          <Link href="/odeca-dashboard/payments/view-list">
                            <Button variant="link" className="p-0 m-0 mr-1 ">
                              <Eye />
                              Consulter
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="border-border bg-card hidden w-80 border-l p-6 xl:block">
            <PaymentStats />
          </div>
        </div>
      </div>
    </div>
  );
}
