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
import { ArrowUpDownIcon, MoreHorizontal, Search, User } from "lucide-react";

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
import ViewImageDialog from "@/components/ui/view-image-dialog";
import Link from "next/link";
import EditIndividualAchats from "./EditIndividualAchats";
import PaginationContent from "@/components/ui/pagination-content";
import { TableSkeleton, TableRowsSkeleton } from "@/components/ui/skeletons";
import { fetchData } from "@/app/_utils/api";
import IndividualAchatsFilter from "./IndividualAchatsFilter";

export default function IndividualAchatsTable({
  isCultivatorsPage,
  externalData,
  datapagination,
  externalTotalCount,
  externalLimit,
  externalExportFn,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [pointer, setPointer] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [searchvalue, setSearchValue] = useState("");

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: limit,
  });

  // Mode contrôlé (SDL detail) : utiliser les données externes du parent
  useEffect(() => {
    if (!isCultivatorsPage && externalData !== undefined) {
      setData(externalData || []);
      setTotalCount(externalTotalCount || 0);
      setLoading(false);
    }
  }, [externalData, externalTotalCount, isCultivatorsPage]);

  // Synchronisation de l'affichage avec la limite externe (cas SDL/CT)
  useEffect(() => {
    if (!isCultivatorsPage && externalLimit) {
      setPagination((prev) => ({ ...prev, pageSize: externalLimit }));
    }
  }, [externalLimit, isCultivatorsPage]);

  // Mode autonome (page achats) : fetch propre
  useEffect(() => {
    if (!isCultivatorsPage) return;
    const getAchats = async () => {
      try {
        const response = await fetchData("get", "cafe/achat_cafe/", {
          params: {
            limit: limit,
            offset: pointer,
            ...filterData,
            search: searchvalue,
          },
        });

        const formattedData = response?.results?.map((achat) => ({
          id: achat?.id,
          cultivator: {
            cultivator_id: achat?.cafeiculteur?.id,
            cultivator_code: achat?.cafeiculteur?.cultivator_code,
            first_name: achat?.cafeiculteur?.cultivator_first_name,
            last_name: achat?.cafeiculteur?.cultivator_last_name,
            image_url: achat?.cafeiculteur?.cultivator_photo,
            cultivator_type: "personel",
          },
          sdl_ct: achat?.responsable?.sdl_ct?.sdl?.sdl_nom
            ? "SDL " + achat.responsable.sdl_ct.sdl.sdl_nom
            : "CT " + achat?.responsable?.sdl_ct?.ct?.ct_nom,
          society:
            achat?.responsable?.sdl_ct?.sdl?.societe?.nom_societe ||
            achat?.responsable?.sdl_ct?.ct?.sdl?.societe?.nom_societe,
          localite: {
            province:
              achat?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code
                ?.province_code?.province_name || "N/A",
            commune:
              achat?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code
                ?.commune_name || "N/A",
          },
          num_fiche: achat?.numero_fiche || "0",
          num_recu: achat?.numero_recu || "N/A",
          photo_fiche: achat?.photo_fiche,
          ca: achat?.quantite_cerise_a || 0,
          cb: achat?.quantite_cerise_b || 0,
          date: achat?.date_achat || "N/A",
        }));

        setData(formattedData || []);
        setTotalCount(response?.count || 0);
      } catch (error) {
        console.error("Error fetching individual achats:", error);
      } finally {
        setLoading(false);
      }
    };

    getAchats();
  }, [limit, pointer, filterData, searchvalue, isCultivatorsPage]);

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
          params: {},
          additionalHeaders: {},
          body: { cafeiculteur_type: "personne", export_type: "DETAIL" },
        },
      );
      if (initial_export.data?.status == "PENDING") {
        setLoadingEportBtn(true);
        const task_id = initial_export?.data?.report_id;
        let isDone = false;
        while (!isDone) {
          const export_excel = await fetchData(
            "get",
            "cafe/achat_cafe/export_achat_status/",
            {
              params: { report_id: task_id },
            },
          );
          if (export_excel.status === "SUCCESS") {
            setActivedownloadBtn(true);
            setReportId(task_id);
            isDone = true;
          } else {
            // Attendre 2 secondes avant la prochaine vérification
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }
    } catch (error) {
      console.error("Erreur exportation Excel :", error);
    } finally {
      setLoadingEportBtn(false);
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
          const cultivator = row.original;
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
                    navigator.clipboard.writeText(
                      cultivator.cultivator.cultivator_code,
                    )
                  }
                >
                  Copier code
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link
                  href={`/odeca-dashboard/cultivators/profile?id=${cultivator.cultivator.cultivator_id}`}
                >
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <div>
                  <EditIndividualAchats
                    id={cultivator?.id}
                    cultivator={cultivator.cultivator}
                    num_fiche={cultivator.num_fiche}
                    num_recu={cultivator.num_recu}
                    ca={cultivator.ca}
                    cb={cultivator.cb}
                    date={cultivator.date}
                    photo_fiche={cultivator.photo_fiche}
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
      {
        accessorKey: "cultivator",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Cafeiculteur
              <ArrowUpDownIcon />
            </Button>
          );
        },
        cell: ({ row }) => {
          const cultivators = row.original.cultivator;
          return (
            <div className="flex items-center gap-3">
              <ViewImageDialog
                imageUrl={cultivators?.image_url}
                alt={`${cultivators?.last_name ?? ""} ${cultivators?.first_name ?? ""}`}
              />
              <div>
                <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                  {`${cultivators?.last_name ?? ""} ${cultivators?.first_name ?? ""}`}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {cultivators?.cultivator_code}
                </span>
              </div>
            </div>
          );
        },
      },
      ...(isCultivatorsPage
        ? [
          {
            accessorKey: "sdl_ct",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  SDL/CT
                  <ArrowUpDownIcon />
                </Button>
              );
            },
            cell: ({ row }) => <div>{row.getValue("sdl_ct")}</div>,
          },
          {
            accessorKey: "society",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  Société
                  <ArrowUpDownIcon />
                </Button>
              );
            },
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
        accessorKey: "num_fiche",
        header: "No Fiche",
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.getValue("num_fiche")}
          </div>
        ),
      },
      {
        accessorKey: "num_recu",
        header: "No Recus",
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.getValue("num_recu")}
          </div>
        ),
      },
      {
        accessorKey: "ca",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              CA
              <ArrowUpDownIcon />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-center font-semibold">{row.getValue("ca")}</div>
        ),
      },
      {
        accessorKey: "cb",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              CB
              <ArrowUpDownIcon />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-center font-semibold">{row.getValue("cb")}</div>
        ),
      },
      {
        accessorKey: "photo_fiche",
        header: "Fiche",
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            <ViewImageDialog
              imageUrl={row.getValue("photo_fiche")}
              alt={`photo_fiche`}
              profile={false}
            />
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.getValue("date")}
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
    setPagination((prev) => ({ ...prev, pageIndex: pageNumber - 1 }));
  };
  const onLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPointer(0);
    setCurrentPage(1);
    setPagination((prev) => ({ ...prev, pageSize: newLimit, pageIndex: 0 }));
  };

  const handleFilter = (filters) => {
    const formattedFilterData = {
      date_achat_min: filters.dateAchatFrom,
      date_achat_max: filters.dateAchatTo,
      enregistrement_min: filters.dateDebutEnregistre,
      enregistrement_max: filters.dateFinEnregistre,
      quantite_a_min: filters.qteMinCA,
      quantite_a_max: filters.qteMaxCA,
      quantite_b_min: filters.qteMinCB,
      quantite_b_max: filters.qteMaxCB,
      province: filters.province,
      commune: filters.commune,
      zone: filters.zone,
      colline: filters.colline,
    };
    setFilterData(formattedFilterData);
    setPointer(0);
    setCurrentPage(1);
  };

  // On affiche le skeleton complet seulement au premier chargement (data vide)
  if (loading && data.length === 0) {
    return <TableSkeleton columns={10} rows={limit} />;
  }

  return (
    <div className="w-full bg-sidebar rounded-lg p-2">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
        <div className="relative">
          <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5" />
          <Input
            placeholder="Rechercher..."
            value={searchvalue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
          />
        </div>

        <div className="flex flex-row justify-between gap-x-3">
          <div className="flex items-center gap-3">
            <IndividualAchatsFilter handleFilter={handleFilter} />
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <ExportButton
              exportType="achats_individual"
              handlerExportAchat={async () => {
                setLoadingEportBtn(true);
                setActivedownloadBtn(false);
                try {
                  if (externalExportFn) {
                    await externalExportFn();
                  } else {
                    await exportCultivatorsToExcel();
                  }
                } finally {
                  setLoadingEportBtn(false);
                }
              }}
              loading={LoadingEportBtn}
              activedownloadBtn={externalExportFn ? false : ActivedownloadBtn}
              onClickDownloadButton={externalExportFn ? undefined : DownloadCultivatorsToExcel}
            />
          </div>
        </div>
      </div>
      <div className="grid w-full [&>div]:border [&>div]:rounded-md overflow-hidden">
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
            {loading ? (
              <TableRowsSkeleton columns={columns.length} rows={limit} />
            ) : table.getRowModel().rows?.length ? (
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
                  Pas de donneés
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
        {/* Mode SDL : pagination du parent. Mode autonome : pagination interne */}
        {!isCultivatorsPage && datapagination ? (
          <PaginationContent
            datapaginationlimit={() => { }}
            currentPage={datapagination.currentPage}
            totalPages={datapagination.totalPages}
            onPageChange={datapagination.onPageChange}
            pointer={datapagination.pointer}
            totalCount={datapagination.totalCount}
            onLimitChange={datapagination.onLimitChange}
            limit={datapagination.limit}
          />
        ) : (
          <PaginationContent
            datapaginationlimit={(l) => {
              setLimit(l);
              setPointer(0);
              setCurrentPage(1);
            }}
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / limit)}
            onPageChange={onPageChange}
            pointer={pointer}
            totalCount={totalCount}
            onLimitChange={onLimitChange}
            limit={limit}
          />
        )}
      </div>
    </div>
  );
}
