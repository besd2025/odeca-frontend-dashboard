import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

const users = [
    {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        identifiant: "john.doe",
        email: "[EMAIL_ADDRESS]",
        category: "Admin",
        phone: "+257 79 000 001",
        status: "Actif",
    },
    {
        id: "2",
        first_name: "Jane",
        last_name: "Smith",
        identifiant: "jane.smith",
        email: "[EMAIL_ADDRESS]",
        category: "General",
        phone: "+257 79 000 002",
        status: "Actif",
    },
    {
        id: "3",
        first_name: "Marius",
        last_name: "Niyomugabo",
        identifiant: "marius.niyo",
        email: "[EMAIL_ADDRESS]",
        category: "Cafe_ODECA",
        phone: "+257 79 000 003",
        status: "Inactif",
    },
    {
        id: "4",
        first_name: "Alice",
        last_name: "Uwimana",
        identifiant: "alice.u",
        email: "[EMAIL_ADDRESS]",
        category: "Admin",
        phone: "+257 79 000 004",
        status: "Actif",
    },
]



export function UserList() {
    return (
        <div className="rounded-md border bg-card/30 backdrop-blur-sm">
            <Table>
                <TableCaption>Liste des utilisateurs de la plateforme.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Utilisateur</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Téléphone</TableHead>
                        {/* <TableHead>Statut</TableHead> */}

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-800 dark:text-white/90">{user.first_name} {user.last_name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.category}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            {/* <TableCell>
                                <span className={`flex items-center gap-1.5 ${user.status === "Actif" ? "text-green-600" : "text-gray-400"}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${user.status === "Actif" ? "bg-green-600 animate-pulse" : "bg-gray-400"}`} />
                                    <span className="text-xs font-medium uppercase tracking-tight">{user.status}</span>
                                </span>
                            </TableCell> */}

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
