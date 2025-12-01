import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

const performers = [
    {
        rank: 1,
        name: "SDL Kayanza",
        volume: "125.4 T",
        quality: "92% A",
        initials: "SK",
    },
    {
        rank: 2,
        name: "SDL Ngozi",
        volume: "98.2 T",
        quality: "88% A",
        initials: "SN",
    },
    {
        rank: 3,
        name: "SDL Gitega",
        volume: "85.7 T",
        quality: "85% A",
        initials: "SG",
    },
    {
        rank: 4,
        name: "SDL Kirundo",
        volume: "72.1 T",
        quality: "81% A",
        initials: "SK",
    },
    {
        rank: 5,
        name: "SDL Muyinga",
        volume: "65.3 T",
        quality: "79% A",
        initials: "SM",
    },
];

export function TopPerformers() {
    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Top SDLs</CardTitle>
                        <CardDescription>Meilleures stations par volume</CardDescription>
                    </div>
                    <Trophy className="text-yellow-500 h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent className="grid gap-6">
                {performers.map((item) => (
                    <div key={item.rank} className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-6 font-bold text-muted-foreground">
                                #{item.rank}
                            </div>
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                <AvatarFallback>{item.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium leading-none">{item.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">Qualité: {item.quality}</p>
                            </div>
                        </div>
                        <div className="font-medium tabular-nums">{item.volume}</div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
