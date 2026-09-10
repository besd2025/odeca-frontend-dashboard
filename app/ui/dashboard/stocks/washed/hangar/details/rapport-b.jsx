"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DAY_LABELS = {
  report: "Report",
  lundi: "Lundi",
  mardi: "Mardi",
  mercredi: "Mercredi",
  jeudi: "Jeudi",
  vendredi: "Vendredi",
  samedi: "Samedi",
  total_semaine: "Total semaine",
  total_general: "Total général",
};

const DEFAULT_CENTERS = [
  { id: "c1", name: "C.C 1 / N.P" },
  { id: "c2", name: "C.C 2 / N.P" },
  { id: "c3", name: "C.C 3 / N.P" },
  { id: "c4", name: "C.C 4 / N.P" },
  { id: "c5", name: "C.C 5 / N.P" },
  { id: "c6", name: "C.C 6 / N.P" },
  { id: "c7", name: "C.C 7 / N.P" },
];

function makeEmptyRow(centers) {
  return {
    centers: Object.fromEntries(centers.map((c) => [c.id, 0])),
    poidsDuJour: 0,
    cumul: 0,
  };
}

function clampNumber(v) {
  const n = Number(v);
  if (Number.isNaN(n) || !Number.isFinite(n)) return 0;
  return Math.max(0, n);
}

export default function RapportBCentresCollecte() {
  const [centers] = React.useState(DEFAULT_CENTERS);

  const [weekStart, setWeekStart] = React.useState("");
  const [weekEnd, setWeekEnd] = React.useState("");

  const [sheet, setSheet] = React.useState(() => ({
    report: makeEmptyRow(DEFAULT_CENTERS),
    lundi: makeEmptyRow(DEFAULT_CENTERS),
    mardi: makeEmptyRow(DEFAULT_CENTERS),
    mercredi: makeEmptyRow(DEFAULT_CENTERS),
    jeudi: makeEmptyRow(DEFAULT_CENTERS),
    vendredi: makeEmptyRow(DEFAULT_CENTERS),
    samedi: makeEmptyRow(DEFAULT_CENTERS),
    total_semaine: makeEmptyRow(DEFAULT_CENTERS),
    total_general: makeEmptyRow(DEFAULT_CENTERS),
  }));

  // Recalcule automatiquement poidsDuJour + cumul + totaux
  React.useEffect(() => {
    const dayKeys = [
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ];
    const totalWeek = makeEmptyRow(centers);

    let runningCumul = sheet.report.cumul || 0;

    const nextSheet = { ...sheet };

    for (const dk of dayKeys) {
      // total centres
      for (const c of centers) {
        totalWeek.centers[c.id] += nextSheet[dk].centers[c.id] || 0;
      }

      // poids du jour = somme des centres
      const dayWeight = centers.reduce(
        (sum, c) => sum + (nextSheet[dk].centers[c.id] || 0),
        0
      );

      nextSheet[dk] = { ...nextSheet[dk], poidsDuJour: dayWeight };

      runningCumul += dayWeight;
      nextSheet[dk] = { ...nextSheet[dk], cumul: runningCumul };
    }

    const totalWeekWeight = dayKeys.reduce(
      (sum, dk) => sum + (nextSheet[dk].poidsDuJour || 0),
      0
    );

    nextSheet.total_semaine = {
      centers: totalWeek.centers,
      poidsDuJour: totalWeekWeight,
      cumul: runningCumul,
    };

    // total général = report + total semaine
    const totalGeneral = makeEmptyRow(centers);
    for (const c of centers) {
      totalGeneral.centers[c.id] =
        (sheet.report.centers[c.id] || 0) + (totalWeek.centers[c.id] || 0);
    }
    totalGeneral.poidsDuJour =
      (sheet.report.poidsDuJour || 0) + totalWeekWeight;
    totalGeneral.cumul = runningCumul;

    nextSheet.total_general = totalGeneral;

    // update seulement si changement (évite boucle)
    const changed =
      JSON.stringify(nextSheet.total_semaine) !==
        JSON.stringify(sheet.total_semaine) ||
      JSON.stringify(nextSheet.total_general) !==
        JSON.stringify(sheet.total_general) ||
      dayKeys.some(
        (dk) =>
          nextSheet[dk].poidsDuJour !== sheet[dk].poidsDuJour ||
          nextSheet[dk].cumul !== sheet[dk].cumul
      );

    if (changed) setSheet(nextSheet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    centers,
    sheet.report.centers,
    sheet.report.cumul,
    sheet.lundi.centers,
    sheet.mardi.centers,
    sheet.mercredi.centers,
    sheet.jeudi.centers,
    sheet.vendredi.centers,
    sheet.samedi.centers,
  ]);

  function updateCenterValue(day, centerId, value) {
    const n = clampNumber(value);
    setSheet((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        centers: { ...prev[day].centers, [centerId]: n },
      },
    }));
  }

  const rows = [
    "report",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "total_semaine",
    "total_general",
  ];

  const isTotalRow = (k) => k === "total_semaine" || k === "total_general";

  return (
    <Card className="rounded-2xl">
      <CardHeader className="gap-2">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl">
              RAPPORT B — Centres de collecte
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Saisie hebdomadaire par centre + poids du jour + cumul
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">
                Semaine du
              </label>
              <Input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="w-[190px]"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">Au</label>
              <Input
                type="date"
                value={weekEnd}
                onChange={(e) => setWeekEnd(e.target.value)}
                className="w-[190px]"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="secondary">Exporter</Button>
              <Button>Enregistrer</Button>
            </div>
          </div>
        </div>
        <Separator />
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto rounded-xl border">
          <Table className="min-w-[1100px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Jour et date</TableHead>

                {centers.map((c) => (
                  <TableHead key={c.id} className="text-center">
                    {c.name}
                  </TableHead>
                ))}

                <TableHead className="text-center">Poids du jour</TableHead>
                <TableHead className="text-center">Cumul</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((dayKey) => (
                <TableRow
                  key={dayKey}
                  className={isTotalRow(dayKey) ? "bg-muted/40" : ""}
                >
                  <TableCell className="font-medium">
                    {DAY_LABELS[dayKey]}
                  </TableCell>

                  {centers.map((c) => {
                    const v = sheet[dayKey].centers[c.id] ?? 0;

                    return (
                      <TableCell key={c.id} className="text-center">
                        {isTotalRow(dayKey) ? (
                          <span className="tabular-nums">{v}</span>
                        ) : (
                          <Input
                            inputMode="numeric"
                            className="h-9 w-[110px] text-center tabular-nums"
                            value={String(v)}
                            onChange={(e) =>
                              updateCenterValue(dayKey, c.id, e.target.value)
                            }
                          />
                        )}
                      </TableCell>
                    );
                  })}

                  <TableCell className="text-center tabular-nums">
                    {sheet[dayKey].poidsDuJour}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {sheet[dayKey].cumul}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Sur mobile : scroll horizontal. Les “Total” sont calculés
          automatiquement.
        </p>
      </CardContent>
    </Card>
  );
}
