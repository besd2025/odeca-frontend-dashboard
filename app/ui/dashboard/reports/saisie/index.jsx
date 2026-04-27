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
import PaginationContent from "@/components/ui/pagination-content";
export default function Saisie() {
  const [sdlData, setSdlData] = React.useState([]);
  const [ctData, setCtData] = React.useState([]);
  const [sdlLimit, setSdlLimit] = React.useState(10);
  const [sdlPointer, setSdlPointer] = React.useState(0);
  const [sdlTotalCount, setSdlTotalCount] = React.useState(0);
  const [sdlCurrentPage, setSdlCurrentPage] = React.useState(1);

  const [ctLimit, setCtLimit] = React.useState(10);
  const [ctPointer, setCtPointer] = React.useState(0);
  const [ctTotalCount, setCtTotalCount] = React.useState(0);
  const [ctCurrentPage, setCtCurrentPage] = React.useState(1);

  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
  };
  React.useEffect(() => {
    const fetchSdlData = async () => {
      try {
        const data = await fetchData("get", `cafe/stationslavage/`, {
          params: { limit: sdlLimit, offset: sdlPointer }
        })
        const mockSdlData = data?.results?.map((item) => ({
          id: item.id,
          responsable_id: item.sdl_responsable?.id,
          name: item.sdl_nom,
          ca: "",
          cb: ""
        }))
        setSdlData(mockSdlData || []);
        setSdlTotalCount(data?.count || 0);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSdlData();
  }, [sdlLimit, sdlPointer])

  React.useEffect(() => {
    const fetchCtData = async () => {
      try {
        const ct = await fetchData("get", `cafe/centres_transite/`, {
          params: { limit: ctLimit, offset: ctPointer }
        });
        const mockCtData = ct?.results?.map((item) => ({
          id: item.id,
          responsable_id: item.ct_responsable?.id,
          name: item.ct_nom,
          ca: "",
          cb: ""
        }))
        setCtData(mockCtData || []);
        setCtTotalCount(ct?.count || 0);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCtData();
  }, [ctLimit, ctPointer])

  const onSdlPageChange = (pageNumber) => {
    setSdlCurrentPage(pageNumber);
    setSdlPointer((pageNumber - 1) * sdlLimit);
  };

  const onSdlLimitChange = (newLimit) => {
    setSdlLimit(newLimit);
    setSdlPointer(0);
    setSdlCurrentPage(1);
  };

  const onCtPageChange = (pageNumber) => {
    setCtCurrentPage(pageNumber);
    setCtPointer((pageNumber - 1) * ctLimit);
  };

  const onCtLimitChange = (newLimit) => {
    setCtLimit(newLimit);
    setCtPointer(0);
    setCtCurrentPage(1);
  };
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
            {/* <Badge variant="outline" className="text-sm text-secondary border-secondary bg-secondary/10 dark:bg-secondary/20 dark:border-secondary dark:text-secondary">
              Province: Butanyerera
            </Badge> */}
          </div>

          <h1 className="text-2xl font-semibold">
            Rapportage de la Semaine
          </h1>
          {/* <div className="flex items-center gap-x-1 mt-2">
            <User />
            <span>Superviseur:</span>
            <span className="font-medium ">Jean Claude</span>
          </div> */}
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
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <input
                    type="text"
                    readOnly
                    value={formatDateDisplay(dateFrom)}
                    placeholder="JJ-MM-AAAA"
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
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
                    id="event-end-date"
                    type="date"
                    value={dateTo || ""}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <input
                    type="text"
                    readOnly
                    value={formatDateDisplay(dateTo)}
                    placeholder="JJ-MM-AAAA"
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
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
            <WeeklyReportGrid items={sdlData} dateFrom={dateFrom} dateTo={dateTo} type="SDL" internalPagination={false} />
            <div className="mt-4 bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800">
              <PaginationContent
                currentPage={sdlCurrentPage}
                totalPages={Math.ceil(sdlTotalCount / sdlLimit)}
                onPageChange={onSdlPageChange}
                pointer={sdlPointer}
                totalCount={sdlTotalCount}
                onLimitChange={onSdlLimitChange}
                limit={sdlLimit}
              />
            </div>
          </TabsContent>

          <TabsContent value="ct" className="m-0 border-none outline-none   p-0 focus:ring-0">
            <WeeklyReportGrid items={ctData} dateFrom={dateFrom} dateTo={dateTo} type="CT" internalPagination={false} />
            <div className="mt-4 bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800">
              <PaginationContent
                currentPage={ctCurrentPage}
                totalPages={Math.ceil(ctTotalCount / ctLimit)}
                onPageChange={onCtPageChange}
                pointer={ctPointer}
                totalCount={ctTotalCount}
                onLimitChange={onCtLimitChange}
                limit={ctLimit}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
