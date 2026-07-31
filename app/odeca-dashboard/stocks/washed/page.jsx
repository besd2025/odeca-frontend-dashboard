"use client";
import React from 'react';
import { UserContext } from '@/app/ui/context/User_Context';
import ProtectedRoute from '@/app/ui/protection/ProtectedRoute';
import { ROLES } from '@/lib/permissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartColumn, List } from 'lucide-react';
import AchatsWashedListTable from '@/app/ui/dashboard/stocks/washed/achats-list';
import CumulatifWashedListTable from '@/app/ui/dashboard/stocks/washed/cumulatif-list';

export default function Page() {
    const user = React.useContext(UserContext);
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ODECA, ROLES.SOCIETE, ROLES.SUPERVISEUR_REGIONAL, ROLES.SUPERVISEUR]}>
            <div className="p-4">
                <Tabs defaultValue="list" className="w-full">
                    <TabsList className="w-full h-10 lg:w-[50%]">
                        <TabsTrigger value="list">
                            <List className="w-4 h-4 mr-2" />
                            <span>Achats</span>
                        </TabsTrigger>
                        {user?.session?.category !== "Superviseur_Regional" && user?.session?.category !== "Cafe_Chef_societe" && (
                            <TabsTrigger value="details">
                                <ChartColumn className="w-4 h-4 mr-2" />
                                <span>Cumulatifs</span>
                            </TabsTrigger>
                        )}
                    </TabsList>
                    <TabsContent value="list">
                        <h1 className="text-2xl font-semibold m-2">
                            Achats du café washed
                        </h1>
                        <AchatsWashedListTable />
                    </TabsContent>
                    <TabsContent value="details">
                        <h1 className="text-2xl font-semibold m-2">
                            Cumulatif des achats par société
                        </h1>
                        <CumulatifWashedListTable />
                    </TabsContent>
                </Tabs>
            </div>
        </ProtectedRoute>
    );
}
