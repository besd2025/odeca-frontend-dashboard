import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
export default function QualiteProduit() {
    const qualite = [
        {
            id: 1,
            qualite: "15+",
            poids: "100kg",
            nombre_sacs: "1000",
            pourcentage: "100%"
        },
        {
            id: 2,
            qualite: "FW",
            poids: "200kg",
            nombre_sacs: "2000",
            pourcentage: "200%"
        },
        {
            id: 3,
            qualite: "TT",
            poids: "300kg",
            nombre_sacs: "3000",
            pourcentage: "300%"
        },
    ]
    return (
        <Card className="p-4">
            <CardTitle className="font-bold text-lg">Qualite Produit</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">Poids de café par qualité</CardDescription>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Qualite</TableHead>
                        <TableHead>Poids</TableHead>
                        <TableHead>Nombre de sacs</TableHead>
                        <TableHead>Pourcentage</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {qualite.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">
                                <Badge variant="outline">{item.qualite}</Badge></TableCell>
                            <TableCell>{item.poids}</TableCell>
                            <TableCell>{item.nombre_sacs}</TableCell>
                            <TableCell>{item.pourcentage}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}
