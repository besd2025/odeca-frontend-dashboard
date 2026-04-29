import React from 'react'
import { ChartAreaInteractive } from './chart-area-interactive'
import { SectionCards } from './SectionCards'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { AlignEndHorizontal, Badge } from 'lucide-react'
import SdlsListTableReports from './sdl'
import CtsListTableReports from './ct'

export default function Reports() {
    return (
        <div><div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <h1 className="text-2xl font-semibold text-foreground px-4 lg:px-6 mb-2">Rapport sur terrain</h1>
                <Tabs
                    defaultValue="outline"
                    className="w-full flex-col justify-start gap-6"
                >
                    <div className="flex items-center justify-between px-4 lg:px-6">

                        <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex gap-x-3">
                            <TabsTrigger value="outline"><AlignEndHorizontal />Détails</TabsTrigger>
                            <TabsTrigger value="SDL">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                    <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
                                </svg>

                                Stations de lavages
                            </TabsTrigger>
                            <TabsTrigger value="CT">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                    <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z" clipRule="evenodd" />
                                </svg>

                                Centre de transite
                            </TabsTrigger>
                        </TabsList>

                    </div>
                    <TabsContent
                        value="outline"
                        className="relative flex flex-col gap-4 overflow-auto"
                    >
                        <div className="flex flex-col gap-4 md:gap-6 ">
                            <SectionCards />
                            <div className="px-4 lg:px-6">
                                {/* <ChartAreaInteractive /> */}
                            </div>

                        </div>
                    </TabsContent>
                    <TabsContent
                        value="SDL"
                        className="flex flex-col px-4 lg:px-6"
                    >
                        < SdlsListTableReports />
                    </TabsContent>
                    <TabsContent value="CT" className="flex flex-col px-4 lg:px-6">
                        <CtsListTableReports />
                    </TabsContent>
                    <TabsContent
                        value="focus-documents"
                        className="flex flex-col px-4 lg:px-6"
                    >
                        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
                    </TabsContent>
                </Tabs>

            </div>
        </div></div>
    )
}
