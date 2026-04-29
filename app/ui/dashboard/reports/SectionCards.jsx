import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Archive, Grape, CircleDollarSign } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function SectionCards() {
    const data = {
        total_cerise_achat: 15420.5,
        total_cerise_a_achat: 10023.3,
        total_cerise_b_achat: 5397.2,
        total_montant_achat: 12500400
    };
    const newQtyToday = 2500;
    const percentageA = 65;
    const percentageB = 35;

    // const total = data?.total_cerise_achat || 0;
    // const percentageA =
    //     total > 0 ? ((data?.total_cerise_a_achat || 0) / total) * 100 : 0;
    // const percentageB =
    //     total > 0 ? ((data?.total_cerise_b_achat || 0) / total) * 100 : 0;
    return (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
            <Card className="@container/card col-span-4 @5xl/main:col-span-2 relative">
                <CardHeader className="flex flex-col">
                    <div className="flex flex-row gap-x-2 items-center">
                        <div className="bg-primary p-2 rounded-md">
                            <Archive className="text-white" />
                        </div>
                        <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
                            {data?.total_cerise_achat >= 1000 ? (
                                <>
                                    {(data?.total_cerise_achat / 1000).toLocaleString("fr-FR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}{" "}
                                    <span className="text-base">T</span>
                                </>
                            ) : (
                                <>
                                    {data?.total_cerise_achat?.toLocaleString("fr-FR") || 0}{" "}
                                    <span className="text-sm">Kg</span>
                                </>
                            )}
                        </CardTitle>
                        {newQtyToday > 0 && (
                            <Badge
                                variant="secondary"
                                className="bg-green-100 dark:bg-green-600/60 text-green-700 dark:text-green-100 px-1 py-0 h-5 ml-4"
                            >
                                <IconTrendingUp size={12} className="mr-0.5" />+
                                {newQtyToday >= 1000 ? (
                                    <>
                                        {(newQtyToday / 1000).toLocaleString("fr-FR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{" "}
                                        T
                                    </>
                                ) : (
                                    <>{newQtyToday.toLocaleString("fr-FR")} Kg</>
                                )}
                            </Badge>
                        )}
                    </div>
                    <CardTitle className="text-lg font-semibold tabular-nums  ">
                        Qte rapportee (CAB)
                    </CardTitle>

                    <div className="mt-2 space-y-3 w-full">
                        <div className="flex justify-between items-end">
                            <span className="text-xs text-muted-foreground ">
                                Rapport Cerise A / B
                            </span>
                            {/* <span className="text-[10px] font-mono text-muted-foreground">
                Ratio: 65%
              </span> */}
                        </div>
                        {/* Barre de progression professionnelle */}
                        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="bg-primary/90"
                                style={{ width: `${percentageA}%` }}
                            />
                            <div
                                className="bg-secondary/90"
                                style={{ width: `${percentageB}%` }}
                            />
                        </div>
                        <div className="flex flex-wrap gap-y-2 justify-between text-xs font-medium">
                            <div className="flex flex-row gap-x-2 items-center bg-primary/10 py-1 px-2 rounded-lg w-max">
                                <span className="text-primary flex items-center gap-1">●</span>
                                <div className="flex flex-row gap-x-1 items-center">
                                    <Grape className="text-primary size-5" />
                                    <CardTitle className="text-md font-semibold text-primary">
                                        CA :
                                    </CardTitle>
                                </div>
                                <CardDescription className="font-semibold text-accent-foreground text-lg">
                                    {data?.total_cerise_a_achat >= 1000 ? (
                                        <>
                                            {(data?.total_cerise_a_achat / 1000).toLocaleString(
                                                "fr-FR",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                },
                                            )}{" "}
                                            <span className="text-sm">T</span>
                                        </>
                                    ) : (
                                        <>
                                            {data?.total_cerise_a_achat?.toLocaleString("fr-FR") || 0}{" "}
                                            <span className="text-sm">Kg</span>
                                        </>
                                    )}
                                    <span className="text-xs font-normal text-muted-foreground ml-2">
                                        ({percentageA.toFixed(1)}%)
                                    </span>
                                </CardDescription>
                            </div>
                            <span className="w-0.5 h-8 bg-black/20 hidden @5xl/main:block">
                                <Separator orientation="vertical" />
                            </span>
                            <div className="flex flex-row gap-x-2 items-center bg-secondary/10 py-1 px-2 rounded-lg">
                                <span className="text-secondary flex items-center gap-1">
                                    ●
                                </span>
                                <div className="flex flex-row gap-x-1 items-center">
                                    <Grape className="text-secondary size-5" />
                                    <CardTitle className="text-md font-semibold text-secondary">
                                        CB :
                                    </CardTitle>
                                </div>
                                <CardDescription className="font-semibold text-accent-foreground text-lg">
                                    {data?.total_cerise_b_achat >= 1000 ? (
                                        <>
                                            {(data?.total_cerise_b_achat / 1000).toLocaleString(
                                                "fr-FR",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                },
                                            )}
                                            <span className="text-sm">T</span>
                                        </>
                                    ) : (
                                        <>
                                            {data?.total_cerise_b_achat?.toLocaleString("fr-FR") || 0}{" "}
                                            <span className="text-sm">Kg</span>
                                        </>
                                    )}
                                    <span className="text-xs font-normal text-muted-foreground ml-2">
                                        ({percentageB.toFixed(1)}%)
                                    </span>
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                    <div className="f/lex flex-col gap-y-1 mt-2 hidden">
                        <div className="flex flex-row gap-x-2 items-center">
                            <div className="rounded-md">
                                <CircleDollarSign className="text-yellow-500 size-4" />
                            </div>
                            <CardTitle className="text-sm text-muted-foreground font-medium tabular-nums">
                                Montant total
                            </CardTitle>
                        </div>
                        <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
                            {Math.round(data?.total_montant_achat ?? 0)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                                FBU
                            </span>
                        </CardTitle>
                    </div>
                </CardHeader>
            </Card>
            <Card className="@container/card col-span-4 @5xl/main:col-span-2 relative">
                <CardHeader>
                    <CardDescription className="text-lg  font-semibold tabular-nums  ">GAP</CardDescription>
                    <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums text-destructive">
                        {data?.total_cerise_achat >= 1000 ? (
                            <>
                                {(data?.total_cerise_achat / 1000).toLocaleString("fr-FR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}{" "}
                                <span className="text-base">T</span>
                            </>
                        ) : (
                            <>
                                {data?.total_cerise_achat?.toLocaleString("fr-FR") || 0}{" "}
                                <span className="text-sm">Kg</span>
                            </>
                        )}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="destructive">
                            <IconTrendingDown />
                            -20%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardContent className="">
                    <div className="flex flex-wrap gap-y-2 justify-between text-xs font-medium">
                        <div className="flex flex-row gap-x-2 items-center bg-primary/10 py-1 px-2 rounded-lg w-max">
                            <span className="text-primary flex items-center gap-1">●</span>
                            <div className="flex flex-row gap-x-1 items-center">
                                <Grape className="text-primary size-5" />
                                <CardTitle className="text-md font-semibold text-primary">
                                    CA :
                                </CardTitle>
                            </div>
                            <CardDescription className="font-semibold text-accent-foreground text-lg">
                                {data?.total_cerise_a_achat >= 1000 ? (
                                    <>
                                        {(data?.total_cerise_a_achat / 1000).toLocaleString(
                                            "fr-FR",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            },
                                        )}{" "}
                                        <span className="text-sm">T</span>
                                    </>
                                ) : (
                                    <>
                                        {data?.total_cerise_a_achat?.toLocaleString("fr-FR") || 0}{" "}
                                        <span className="text-sm">Kg</span>
                                    </>
                                )}
                                {/* <span className="text-xs font-normal text-muted-foreground ml-2">
                                    ({percentageA.toFixed(1)}%)
                                </span> */}
                            </CardDescription>
                        </div>
                        <span className="w-0.5 h-8 bg-black/20 hidden @5xl/main:block">
                            <Separator orientation="vertical" />
                        </span>
                        <div className="flex flex-row gap-x-2 items-center bg-secondary/10 py-1 px-2 rounded-lg">
                            <span className="text-secondary flex items-center gap-1">
                                ●
                            </span>
                            <div className="flex flex-row gap-x-1 items-center">
                                <Grape className="text-secondary size-5" />
                                <CardTitle className="text-md font-semibold text-secondary">
                                    CB :
                                </CardTitle>
                            </div>
                            <CardDescription className="font-semibold text-accent-foreground text-lg">
                                {data?.total_cerise_b_achat >= 1000 ? (
                                    <>
                                        {(data?.total_cerise_b_achat / 1000).toLocaleString(
                                            "fr-FR",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            },
                                        )}
                                        <span className="text-sm">T</span>
                                    </>
                                ) : (
                                    <>
                                        {data?.total_cerise_b_achat?.toLocaleString("fr-FR") || 0}{" "}
                                        <span className="text-sm">Kg</span>
                                    </>
                                )}
                                {/* <span className="text-xs font-normal text-muted-foreground ml-2">
                                    ({percentageB.toFixed(1)}%)
                                </span> */}
                            </CardDescription>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Gap de 20% <IconTrendingDown className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Par rapport au quantite collectee
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
