"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDownIcon,
  MoreHorizontal,
  Search,
  ShieldUser,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ExportButton from "@/components/ui/export_button";
import AssociationFilter from "../AssociationFilter";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import Edit from "../edit";
import Link from "next/link";
import PaginationContent from "@/components/ui/pagination-content";
import { TableSkeleton } from "@/components/ui/skeletons";
import { fetchData } from "@/app/_utils/api";
const XLSX = require("xlsx");
import { saveAs } from "file-saver";

export default function AssociationCultivatorsTable({ isCultivatorsPage }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [pointer, setPointer] = useState(0);
  const [filterData, setFilterData] = useState(null);
  const [searchvalue, setSearchValue] = useState("");

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });
  useEffect(() => {
    const getCultivatorsAssociation = async () => {
      setLoading(true);
      try {
        const response = await fetchData(
          "get",
          "cultivators/get_cafe_cultivators/?cafeiculteur_type=association",
          {
            params: {
              limit: limit,
              offset: pointer,
              ...filterData,
              search: searchvalue,
            },
          },
        );

        const formattedData = response.results.map((cultivator) => ({
          id: cultivator.id,
          cultivator: {
            cultivator_code: cultivator?.cultivator_code,
            first_name: cultivator?.cultivator_first_name,
            last_name: cultivator?.cultivator_last_name,
            image_url: cultivator?.cultivator_photo,
            telephone: cultivator?.cultivator_telephone,
            cultivator_assoc_name: cultivator?.cultivator_assoc_name,
            cultivator_assoc_rep_name: cultivator?.cultivator_assoc_rep_name,
            cultivator_assoc_nif: cultivator?.cultivator_assoc_nif,
            cultivator_assoc_rep_phone: cultivator?.cultivator_assoc_rep_phone,
            cultivator_assoc_numero_fiche:
              cultivator?.cultivator_assoc_numero_fiche,
          },
          sdl_ct: cultivator?.ct_sdl_name,
          society: cultivator?.societe_name,
          localite: {
            province:
              cultivator?.cultivator_adress?.zone_code?.commune_code
                ?.province_code?.province_name,
            commune:
              cultivator?.cultivator_adress?.zone_code?.commune_code
                ?.commune_name,
          },
          champs: cultivator?.nombre_champs,
        }));

        setData(formattedData);
        setTotalCount(response.count);
      } catch (error) {
        console.error("Error fetching association cultivators:", error);
      } finally {
        setLoading(false);
      }
    };

    getCultivatorsAssociation();
  }, [pointer, limit, filterData, searchvalue]);

  // const onExportAssociationToExcel = async () => {
  //   try {
  //     const initResponse = await fetchData(
  //       "get",
  //       `cultivators/get_cafe_cultivators?cafeiculteur_type=association`,
  //       { params: { limit: 1 } },
  //     );
  //     const total = initResponse?.count || 0;
  //     if (total === 0) return;

  //     const response = await fetchData(
  //       "get",
  //       `cultivators/get_cafe_cultivators?cafeiculteur_type=association`,
  //       { params: { limit: total } },
  //     );

  //     const allData = response.results || [];
  //     const formattedData = allData.map((item) => ({
  //       code_cultivateur: item.cultivator_code || "",
  //       Type: item.cultivator_entity_type || "",
  //       association: item.cultivator_assoc_name || "",
  //       Représentant_de_lassociation: item.cultivator_assoc_rep_name || "",
  //       telephone_du_représentant: item.cultivator_assoc_rep_phone || "",
  //       numero_fiche: item.cultivator_assoc_numero_fiche || "",
  //       NIF_de_lassociation: item.cultivator_assoc_nif || "",
  //       Province:
  //         item.cultivator_adress?.zone_code?.commune_code?.province_code
  //           ?.province_name || "",
  //       Commune:
  //         item.cultivator_adress?.zone_code?.commune_code?.commune_name || "",
  //       Zone: item.cultivator_adress?.zone_code?.zone_name || "",
  //       Colline: item.cultivator_adress?.colline_name || "",
  //       Societe: item?.collector?.hangar?.hangar_name || "",
  //       Nombre_de_champs: item.nombre_champs || 0,
  //       Superficie_totale_des_champs: item.superficie_totale_champs || 0,
  //     }));

  //     const worksheet = XLSX.utils.json_to_sheet(formattedData);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Associations");
  //     const excelBuffer = XLSX.write(workbook, {
  //       bookType: "xlsx",
  //       type: "array",
  //     });
  //     const blob = new Blob([excelBuffer], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  //     });
  //     saveAs(
  //       blob,
  //       `associations_${new Date().toISOString().split("T")[0]}.xlsx`,
  //     );
  //   } catch (error) {
  //     console.error("Erreur exportation Excel :", error);
  //   }

  //Export Function
  const [reportId, setReportId] = useState("");
  const [LoadingEportBtn, setLoadingEportBtn] = useState(false);
  const [ActivedownloadBtn, setActivedownloadBtn] = useState(false);
  const exportCultivatorsToExcel = async () => {
    setLoadingEportBtn(true);
    try {
      // Étape 1 : Récupérer le nombre total d'enregistrements
      const initial_export = await fetchData(
        "post",
        "/cafe/achat_cafe/export_achat_quantites/",
        {
          params: { cafeiculteur_type: "associtation", export_type: "RESUME" },
          additionalHeaders: {},
          body: {},
        },
      );
      console.log("export data ", initial_export);
      if (initial_export.data?.status == "PENDING") {
        setLoadingEportBtn(true);
        const task_id = initial_export?.data?.report_id;
        const intervalId = setInterval(async () => {
          const export_excel = await fetchData(
            "get",
            "cafe/achat_cafe/export_achat_status/",
            {
              params: { report_id: task_id },
            },
          );
          if (export_excel.status === "SUCCESS") {
            clearInterval(intervalId); // Arrêtez l'intervalle
            setLoadingEportBtn(false);
            setActivedownloadBtn(true);
            setReportId(task_id);
          }
        }, 2000);
      }

      // Vérifier toutes les 6 secondes
    } catch (error) {
      console.error("Erreur exportation Excel :", error);
    } finally {
      //setLoadingEportBtn(false);
    }
  };
  const DownloadCultivatorsToExcel = async () => {
    try {
      const response = await fetchData("get", "/cafe/achat_cafe/download/", {
        params: { report_id: reportId },
        isBlob: true,
      });
      console.log("downloard", response);
      // Créer le blob avec le bon type MIME
      const blob = new Blob([response.data], {
        type:
          response.headers["content-type"] ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const timestamp = `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;
      // Nom du fichier par défaut
      let filename = `cultivator_list_${timestamp}.xlsx`;

      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      }

      // Création du <a> temporaire
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Nettoyage
      link.remove();
      window.URL.revokeObjectURL(url);

      setActivedownloadBtn(false);
    } catch (error) {
      console.error("Erreur lors de l'exportation Excel :", error);
    } finally {
      setLoadingEportBtn(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => {
          const result = row.original;
          const cultivator = result.cultivator;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel className="text-muted-foreground font-normal">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(cultivator?.cultivator_code)
                  }
                >
                  Copier code
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link
                  href={`/odeca-dashboard/cultivators/profile/?id=${result?.id}`}
                >
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <div>
                  <Edit
                    cultivator={result?.id}
                    sdl_ct={result?.sdl_ct}
                    society={result?.society}
                    localite={result?.localite}
                    champs={result?.champs}
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
      {
        accessorKey: "cultivator",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Association / Coopérative
            <ArrowUpDownIcon />
          </Button>
        ),
        filterFn: (row, columnId, filterValue) => {
          const cultivator = row.original.cultivator;
          if (!filterValue) return true;
          const search = filterValue.toLowerCase();
          return (
            (cultivator?.cultivator_assoc_name || "")
              .toLowerCase()
              .includes(search) ||
            (cultivator?.cultivator_code || "").toLowerCase().includes(search)
          );
        },
        cell: ({ row }) => {
          const cultivators = row.original.cultivator;
          return (
            <div className="flex items-center gap-3">
              <ViewImageDialog
                imageUrl={cultivators?.image_url || null}
                alt={cultivators?.cultivator_assoc_name}
              />
              <div>
                <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                  {cultivators?.cultivator_assoc_name}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  <span className="flex items-center">
                    <ShieldUser size={18} /> rep:{" "}
                    {cultivators?.cultivator_assoc_rep_name}
                  </span>
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: "Telephone",
        header: "Téléphone",
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.original.cultivator?.telephone}
          </div>
        ),
      },
      ...(isCultivatorsPage
        ? [
            {
              accessorKey: "sdl_ct",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  SDL/CT
                  <ArrowUpDownIcon />
                </Button>
              ),
              cell: ({ row }) => <div>{row.getValue("sdl_ct")}</div>,
            },
            {
              accessorKey: "society",
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  Société
                  <ArrowUpDownIcon />
                </Button>
              ),
              cell: ({ row }) => (
                <div className="font-medium">{row.getValue("society")}</div>
              ),
            },
          ]
        : []),
      {
        id: "localite",
        header: "Localité",
        cell: ({ row }) => {
          const localite = row.original.localite;
          return (
            <div className="text-sm">
              {localite?.commune}, {localite?.province}
            </div>
          );
        },
      },
      {
        accessorKey: "champs",
        header: "Champs",
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.getValue("champs")}
          </div>
        ),
      },
    ],
    [isCultivatorsPage],
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPointer((pageNumber - 1) * limit);
  };

  const onLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPointer(0);
    setCurrentPage(1);
  };

  if (loading && data.length === 0) {
    return <TableSkeleton columns={6} rows={10} />;
  }

  return (
    <div className="w-full bg-sidebar p-2 rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4 ">
        <div className="relative ">
          <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 " />
          <Input
            placeholder="Rechercher..."
            value={searchvalue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
          />
        </div>

        <div className="flex flex-row justify-between gap-x-3">
          <div className="flex items-center gap-3">
            <AssociationFilter handleFilter={setFilterData} />
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <ExportButton
              exportType="cultivator_association"
              onExportAssociationToExcel={exportCultivatorsToExcel}
              loading={LoadingEportBtn}
              activedownloadBtn={ActivedownloadBtn}
              onClickDownloadButton={DownloadCultivatorsToExcel}
            />
          </div>
        </div>
      </div>
      <div className="grid w-full [&>div]:max-h-max [&>div]:border [&>div]:rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="sticky top-0 bg-background z-10 hover:bg-background"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Pas de resultats
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
        <div className="flex-1 text-sm text-muted-foreground"></div>
        <PaginationContent
          datapaginationlimit={(l) => {
            if (l <= totalCount)
              setPagination((prev) => ({ ...prev, pageSize: l }));
            else setPagination((prev) => ({ ...prev, pageSize: totalCount }));
          }}
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
