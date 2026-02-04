"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchData } from "@/app/_utils/api";
import SdlsListTable from "../../sdl/list"; // Reusing SDL list component
// Note: We might need a modified version of SdlsListTable if it strictly fetches 'cafe/stationslavage/'
// But SdlsListTable in 'sdl/list/index.jsx' accepts 'isLoading' but hardcodes the fetch in useEffect.
// I should probably make SdlsListTable accept 'data' as prop or create a new 'RelatedSdlsTable'.
// For now, I'll update SdlsListTable to accept optional 'data' or 'fetchUrl'?
// The current SdlsListTable fetches data internally.
// I should create a local table for related SDLs/CTs to match the 'list' style but with provided data.
// Or I can just start with a simple table here.

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

function RelatedTable({ data, type }) {
  const columns = [
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "location",
      header: "Localité",
    },
    {
      accessorKey: "responsable",
      header: "Responsable",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function DetailsContent({ id }) {
  const [tab, setTab] = useState("sdls");
  const [sdls, setSdls] = React.useState([]);
  const [cts, setCts] = React.useState([]);

  React.useEffect(() => {
    const getRelatedSdls = async () => {
      try {
        const response = await fetchData("get", `cafe/stationslavage/`, {
          params: { societe: id },
        });
      } catch (error) {
        console.error("Error fetching related SDLs:", error);
      }
    };
  }, [id]);

  React.useEffect(() => {
    // Fetch SDLs
    const fetchSdls = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/societes/${id}/get_sdls/`,
          {},
        );
        // Map to simple structure
        const results = response?.results || [];
        setSdls(
          results.map((sdl) => ({
            code: sdl.sdl_code,
            name: sdl.sdl_nom,
            location: sdl.sdl_adress?.zone_code?.commune_code?.commune_name,
          })),
        );
      } catch (e) {
        console.log(e);
      }
    };

    const fetchCts = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/societes/${id}/get_cts/`,
          {},
        );
        const results = response?.results || [];
        setCts(
          results.map((ct) => ({
            code: ct.ct_code,
            name: ct.ct_nom,
            location: ct.ct_adress?.zone_code?.commune_code?.commune_name,
          })),
        );
      } catch (e) {
        console.log(e);
      }
    };

    if (id) {
      fetchSdls();
      fetchCts();
    }
  }, [id]);

  return (
    <Card className="p-4 space-y-4 rounded-xl shadow-sm bg-white dark:bg-sidebar border-none">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="sdls">SDLs Associés</TabsTrigger>
          <TabsTrigger value="cts">CTs Associés</TabsTrigger>
        </TabsList>
        <TabsContent value="sdls" className="mt-4 space-y-4">
          <h2 className="text-xl font-semibold">Liste des SDLs</h2>
          <RelatedTable data={sdls} type="SDL" />
        </TabsContent>
        <TabsContent value="cts" className="mt-4 space-y-4">
          <h2 className="text-xl font-semibold">Liste des CTs</h2>
          <RelatedTable data={cts} type="CT" />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default DetailsContent;
