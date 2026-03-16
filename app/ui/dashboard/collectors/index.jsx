"use client";
import React, { useState, useMemo } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationContent from "@/components/ui/pagination-content";
import { Edit } from "./edit";

const allCollectors = [
  {
    id: 1,
    first_name: "Jean",
    last_name: "Dupont",
    phone: "+225 01 02 03 04 05",
    identifiant: "COL-001",
    sdl_ct: "SDL Abidjan",
    cni: "C00123456",
  },
  {
    id: 2,
    first_name: "Marie",
    last_name: "Curie",
    phone: "+225 05 06 07 08 09",
    identifiant: "COL-002",
    sdl_ct: "CT Bouaké",
    cni: "C00123457",
  },
  {
    id: 3,
    first_name: "Koffi",
    last_name: "Kouadio",
    phone: "+225 07 08 09 10 11",
    identifiant: "COL-003",
    sdl_ct: "SDL Yamoussoukro",
    cni: "C00123458",
  },
  {
    id: 4,
    first_name: "Awa",
    last_name: "Cissé",
    phone: "+225 09 10 11 12 13",
    identifiant: "COL-004",
    sdl_ct: "CT San Pédro",
    cni: "C00123459",
  },
  {
    id: 5,
    first_name: "Moussa",
    last_name: "Traoré",
    phone: "+225 01 11 22 33 44",
    identifiant: "COL-005",
    sdl_ct: "SDL Korhogo",
    cni: "C00123460",
  },
  {
    id: 6,
    first_name: "Fatou",
    last_name: "Diaby",
    phone: "+225 05 22 33 44 55",
    identifiant: "COL-006",
    sdl_ct: "CT Man",
    cni: "C00123461",
  },
];

export default function CollectorsList() {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [pointer, setPointer] = useState(0);

  const filteredCollectors = useMemo(() => {
    if (!searchValue) return allCollectors;
    const lowerSearch = searchValue.toLowerCase();
    return allCollectors.filter(
      (c) =>
        c.first_name.toLowerCase().includes(lowerSearch) ||
        c.last_name.toLowerCase().includes(lowerSearch) ||
        c.identifiant.toLowerCase().includes(lowerSearch) ||
        c.phone.toLowerCase().includes(lowerSearch) ||
        c.sdl_ct.toLowerCase().includes(lowerSearch),
    );
  }, [searchValue]);

  const totalCount = filteredCollectors.length;
  const paginatedCollectors = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredCollectors.slice(start, start + limit);
  }, [filteredCollectors, currentPage, limit]);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPointer((pageNumber - 1) * limit);
  };

  const onLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPointer(0);
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-sidebar p-2 rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
        <div className="relative">
          <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1);
              setPointer(0);
            }}
            className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background border-none"
          />
        </div>
        {/* Ajouter d'autres actions ici si nécessaire */}
      </div>

      <div className="grid w-full [&>div]:border [&>div]:rounded-md overflow-hidden ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Collecteurs</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>SDL/CT</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCollectors.length > 0 ? (
              paginatedCollectors.map((collector) => (
                <TableRow className="odd:bg-muted/50" key={collector.id}>
                  <TableCell>
                    <div>
                      <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                        {`${collector?.last_name} ${collector?.first_name}`}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {collector?.identifiant}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{collector.phone}</TableCell>
                  <TableCell>{collector.sdl_ct}</TableCell>
                  <TableCell className="text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(collector.identifiant)
                          }
                        >
                          Copier l'ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Edit collector={collector} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Pas de résultats.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
        <div className="flex-1 text-sm text-muted-foreground"></div>
        <PaginationContent
          datapaginationlimit={() => {}}
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / limit)}
          onPageChange={onPageChange}
          pointer={pointer}
          totalCount={totalCount}
          onLimitChange={onLimitChange}
        />
      </div>
    </div>
  );
}
