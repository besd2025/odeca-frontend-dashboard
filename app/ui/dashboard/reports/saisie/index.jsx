"use client"
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Send, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeeklyReportGrid from '@/app/ui/dashboard/reports/weekly-report-grid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { fetchData } from '@/app/_utils/api';


export default function Saisie() {
  // Mocks de données pour la province du superviseur (ex: Ngozi)
  const mockSdlData = [
    { id: 1, name: "SDL Kiremba", ca: "", cb: "" },
    { id: 2, name: "SDL Nyarusagera", ca: "", cb: "" },
    { id: 3, name: "SDL Gashiru", ca: "", cb: "" },
    { id: 4, name: "SDL Mwumba", ca: "", cb: "" },
  ];

  const mockCtData = [
    { id: 101, name: "CT Ngozi Centre", ca: "", cb: "" },
    { id: 102, name: "CT Murehe", ca: "", cb: "" },
  ];
  const [sdlData, setSdlData] = React.useState([]);
  const [ctData, setCtData] = React.useState([]);
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  React.useEffect(() => {
    const fetchSdlData = async () => {
      try {
        const data = await fetchData("get", `cafe/stationslavage/`);
        const mockSdlData = data?.results?.map((item) => ({
          id: item.id,
          name: item.sdl_nom,
          ca: "",
          cb: ""
        }))
        const ct = await fetchData("get", `cafe/centres_transite/`);
        const mockCtData = ct?.results?.map((item) => ({
          id: item.id,
          name: item.ct_nom,
          ca: "",
          cb: ""
        }))
        setSdlData(mockSdlData);
        setCtData(mockCtData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSdlData();
  }, [])
  return (
    <div className="p-2 md:p-8 gap-y-6 max-w-7xl flex flex-col min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/odeca-dashboard/reports">
              <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
                <ChevronLeft className="w-5 h-5 mr-1" />
                Retour
              </Button>
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Badge variant="outline" className="text-sm text-secondary border-secondary bg-secondary/10 dark:bg-secondary/20 dark:border-secondary dark:text-secondary">
              Province: Butanyerera
            </Badge>
          </div>

          <h1 className="text-2xl font-semibold">
            Rapportage de la Semaine
          </h1>
          <div className="flex items-center gap-x-1 mt-2">
            <User />
            <span>Superviseur:</span>
            <span className="font-medium ">Jean Claude</span>
          </div>
        </div>

        {/* Sélecteur de semaine en haut */}
        {/* <div className="w-full md:w-64">
          <label className="text-sm font-medium mb-1.5 block text-gray-700 dark:text-gray-300">
            Période (Semaine)
          </label>
          <Select defaultValue="sem-12">
            <SelectTrigger className="w-full bg-white dark:bg-zinc-950 border-gray-300 dark:border-zinc-800">
              <SelectValue placeholder="Sélectionnez une semaine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sem-13">Semaine 13 (Du 25 au 31 Mars 2026)</SelectItem>
              <SelectItem value="sem-12">Semaine 12 (Du 18 au 24 Mars 2026)</SelectItem>
              <SelectItem value="sem-11">Semaine 11 (Du 11 au 17 Mars 2026)</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      <div className=" shadow-none">
        <div className="grid grid-cols-2 gap-4 mb-4 bg-card p-4 rounded-md max-w-md">
          <div className="col-span-2 lg:col-span-1 ">
            <div className="space-y-2">
              <div className="">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Depuis
                </label>
                <div className="relative">
                  <input
                    id="event-start-date"
                    type="date"
                    value={dateFrom || ""}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 z-9999">
            <div className="space-y-2">
              <div className="">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Jusqu'à
                </label>
                <div className="relative">
                  <input
                    id="event-start-date"
                    type="date"
                    value={dateTo || ""}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Tabs defaultValue="sdl" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="sdl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                  clipRule="evenodd"
                />
              </svg>
              Stations de Lavage
            </TabsTrigger>
            <TabsTrigger value="ct">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Centres de Transite
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sdl" className="border-none outline-none p-0 focus:ring-0">

            <WeeklyReportGrid items={sdlData} dateFrom={dateFrom} dateTo={dateTo} type="SDL" />
          </TabsContent>

          <TabsContent value="ct" className="m-0 border-none outline-none   p-0 focus:ring-0">
            <WeeklyReportGrid items={ctData} dateFrom={dateFrom} dateTo={dateTo} type="CT" />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
