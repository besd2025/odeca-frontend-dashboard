import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const transactions = [
    {
        id: "TX-001",
        type: "Collecte",
        entity: "SDL Kayanza",
        amount: "1,250 kg",
        value: "1.5M FBU",
        date: "2024-05-20",
        status: "Completed",
    },
    {
        id: "TX-002",
        type: "Vente",
        entity: "Exportateur A",
        amount: "5,000 kg",
        value: "12.5M FBU",
        date: "2024-05-19",
        status: "Pending",
    },
    {
        id: "TX-003",
        type: "Collecte",
        entity: "SDL Ngozi",
        amount: "850 kg",
        value: "950k FBU",
        date: "2024-05-19",
        status: "Completed",
    },
    {
        id: "TX-004",
        type: "Collecte",
        entity: "SDL Gitega",
        amount: "2,100 kg",
        value: "2.8M FBU",
        date: "2024-05-18",
        status: "Completed",
    },
    {
        id: "TX-005",
        type: "Vente",
        entity: "Local Market",
        amount: "500 kg",
        value: "600k FBU",
        date: "2024-05-18",
        status: "Completed",
    },
];

export function RecentTransactions() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Transactions Récentes</CardTitle>
                <CardDescription>Derniers mouvements de stock et ventes</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Entité</TableHead>
                            <TableHead className="text-right">Quantité</TableHead>
                            <TableHead className="text-right">Valeur</TableHead>
                            <TableHead className="hidden sm:table-cell">Statut</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>
                                    <div className="font-medium">{tx.type}</div>
                                    <div className="text-xs text-muted-foreground sm:hidden">
                                        {tx.date}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{tx.entity}</div>
                                    <div className="text-xs text-muted-foreground hidden sm:block">
                                        {tx.date}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">{tx.amount}</TableCell>
                                <TableCell className="text-right">{tx.value}</TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge
                                        variant={tx.status === "Completed" ? "default" : "secondary"}
                                        className="text-xs"
                                    >
                                        {tx.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
