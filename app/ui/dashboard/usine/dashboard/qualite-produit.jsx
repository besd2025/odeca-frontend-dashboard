"use client"
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
import { fetchData } from "@/app/_utils/api";
import React from "react";
export default function QualiteProduit() {

    const [data, setData] = React.useState([{
        id: 0,
        qualite: "",
        poids: "",
        nombre_sacs: "",
        pourcentage: ""
    }
    ])

    React.useEffect(() => {
        const fetch = async () => {
            const response = await fetchData('get', 'cafe/stock_cafe/stock_stats_par_quantite/')
            const newData = response?.data?.map((item) => {
                return {
                    id: item?.code,
                    qualite: item?.qualite,
                    poids: item?.poids_total,
                    nombre_sacs: item?.sacs_total,
                    pourcentage: item?.pourcentage
                }
            })


            setData(newData)

        }
        fetch()
    }, [])

    return (
        <Card className="p-4">
            <CardTitle className="font-bold text-lg">Qualite Produit</CardTitle>
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
                    {data?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">
                                <Badge variant="outline">{item.qualite}</Badge></TableCell>
                            <TableCell className="normal-case">

                                {(item.poids) >= 1000 ? (
                                    <>
                                        {((item.poids) / 1000).toLocaleString("fr-FR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{" "}
                                        <span className="">T</span>
                                    </>
                                ) : (
                                    <>
                                        {(item.poids)?.toLocaleString("fr-FR") || 0}{" "}
                                        <span className="">Kg</span>
                                    </>
                                )}

                            </TableCell>
                            <TableCell className="normal-case">{item.nombre_sacs} sacs</TableCell>
                            <TableCell className="normal-case">{item.pourcentage}%</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}
