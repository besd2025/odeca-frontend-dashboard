import SocietesQty from '@/app/ui/production/societes'
import StockInitialList from '@/app/ui/production/societes/stockInitialList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from 'react'

export default function page() {
    return (
        <div className='p-4'>
            <Tabs defaultValue="parched">
                <TabsList className="w-full md:w-1/2">
                    <TabsTrigger value="initials">Stocks initiaux</TabsTrigger>
                    <TabsTrigger value="parched">Café Parche Receptionné</TabsTrigger>
                </TabsList>
                <TabsContent value="initials">
                    <StockInitialList />
                </TabsContent>
                <TabsContent value="parched">
                    <SocietesQty />
                </TabsContent>
            </Tabs>
        </div>
    )
}
