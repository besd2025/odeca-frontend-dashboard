"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Grape, Save, Send, User } from 'lucide-react';
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
import { useEffect, useState } from 'react';
import { fetchData } from '@/app/_utils/api';
import { useSearchParams } from 'next/navigation';

export default function DetailsReports() {
    // Mocks de données pour la province du superviseur (ex: Ngozi)
    const searchParams = useSearchParams();
    const id = searchParams.get("id_rapport");
    const [SDLreport, setSDLReport] = useState([]);
    const [CTreport, setCTReport] = useState([]);
    const mockSdlData = [
        { id: 1, name: "SDL Kiremba", ca: "300", cb: "350" },
        { id: 2, name: "SDL Nyarusagera", ca: "400", cb: "420" },
        { id: 3, name: "SDL Gashiru", ca: "254", cb: "260" },
        { id: 4, name: "SDL Mwumba", ca: "200", cb: "200" },
    ];

    const mockCtData = [
        { id: 101, name: "CT Ngozi Centre", ca: "50", cb: "60" },
        { id: 102, name: "CT Murehe", ca: "50", cb: "40" },
    ];


    const [totals, setTotals] = useState({ ca: 0, cb: 0, general: 0 });
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetchData("get", `cafe/rapportages_sdl_ct_semaine/${id}/get_list_sdl_ct_per_week/`);
                const responseValue = await fetchData("get", `cafe/rapportages_sdl_ct_semaine/${id}/`);
                const items = response?.results || [];

                const sdlItems = items.filter(item => item.sdl_ct?.sdl_ct?.sdl?.sdl_nom).map((item) => ({
                    id: item.id,
                    responsable_id: item.sdl_ct?.sdl_ct?.sdl?.id,
                    name: item.sdl_ct?.sdl_ct?.sdl?.sdl_nom,
                    ca: item.quantite_cerise_a,
                    cb: item.quantite_cerise_b
                }));
                const ctItems = items.filter(item => item.sdl_ct?.sdl_ct?.ct?.ct_nom).map((item) => ({
                    id: item.id,
                    responsable_id: item.sdl_ct?.sdl_ct?.ct?.id,
                    name: item.sdl_ct?.sdl_ct?.ct?.ct_nom,
                    ca: item.quantite_cerise_a,
                    cb: item.quantite_cerise_b
                }));

                setSDLReport(sdlItems);
                setCTReport(ctItems);

                // Calculer les totaux dynamiques
                setTotals({
                    ca: responseValue?.quantite_cerise_a,
                    cb: responseValue?.quantite_cerise_b,
                    general: responseValue?.quantite_cerise_a + responseValue?.quantite_cerise_b
                });
            } catch (error) {
                console.error("Error fetching report:", error);
            }
        };
        if (id) fetchReport();
    }, [id]);

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
                        Rapportage de la Semaine 12 (Du 25 au 31 Mars 2026)
                    </h1>
                    <div className="flex items-center gap-x-1 mt-2">
                        <User />
                        <span>Superviseur:</span>
                        <span className="font-medium ">Jean Claude</span>
                    </div>
                </div>
            </div>

            <div className=" shadow-none">
                <div className="flex flex-col gap-y-1 bg-card rounded-md p-3 mb-4">
                    <h1 className="text-xl font-semibold">Total General: {totals.general.toLocaleString()} Kg</h1>
                    <div className="flex items-center gap-x-1 pl-4"><Grape className="text-primary size-5" />
                        <h1 className="text-md ">Total CA: {totals.ca.toLocaleString()} Kg</h1>
                    </div>
                    <div className="flex items-center gap-x-1 pl-4"><Grape className="text-secondary size-5" />
                        <h1 className="text-md ">Total CB: {totals.cb.toLocaleString()} Kg</h1>
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

                        <WeeklyReportGrid items={SDLreport} type="SDL" readOnly={true} />
                    </TabsContent>

                    <TabsContent value="ct" className="m-0 border-none outline-none   p-0 focus:ring-0">
                        <WeeklyReportGrid items={CTreport} type="CT" readOnly={true} />
                    </TabsContent>
                </Tabs>

            </div>

        </div>
    );
}
