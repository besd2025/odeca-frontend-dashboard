import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent as PaginationContentUI,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PaginationContent = ({
  datapaginationlimit,
  currentPage,
  totalPages,
  onPageChange,
  pointer,
  totalCount,
  onLimitChange, // Nouvelle prop pour gérer le changement de limite
  className,
}) => {
  const [limit, setLimit] = useState(5); // Limite par défaut

  // Calcul des pages à afficher
  const pagesToShow = [];
  const startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, startPage + 2);
  for (let i = startPage; i <= endPage; i++) {
    pagesToShow.push(i);
  }

  const dataNumberOptions = [5, 10, 50, 100];

  const handleDataNumber = (selectedOption) => {
    const newLimit = selectedOption;
    setLimit(newLimit);
    onLimitChange(newLimit); // Appelle la fonction pour mettre à jour la limite
    onPageChange(1); // Réinitialise à la première page
  };

  const actualPointer = Number(pointer);
  const actualLimit = Number(limit);

  React.useEffect(() => {
    datapaginationlimit(limit);
  }, [limit]);

  const canGoToPrevious = currentPage > 1;
  const canGoToNext = currentPage < totalPages;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800 sm:px-6 w-full",
        className,
      )}
    >
      <div className="flex-1 text-sm text-muted-foreground">
        Affichage de{" "}
        <span className="font-medium">
          {totalCount === 0 ? 0 : pointer + 1}
        </span>{" "}
        à{" "}
        <span className="font-medium">
          {Math.min(actualPointer + actualLimit, totalCount)}
        </span>{" "}
        sur <span className="font-medium">{totalCount}</span> résultats
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground whitespace-nowrap">
            Par page
          </span>
          <Select
            value={String(limit)}
            onValueChange={(value) => handleDataNumber(Number(value))}
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent>
              {dataNumberOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Pagination>
          <PaginationContentUI>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={!canGoToPrevious}
                className={cn(
                  !canGoToPrevious && "pointer-events-none opacity-50",
                )}
                onClick={(event) => {
                  event.preventDefault();
                  if (canGoToPrevious) {
                    onPageChange(currentPage - 1);
                  }
                }}
              />
            </PaginationItem>

            {pagesToShow.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(event) => {
                    event.preventDefault();
                    onPageChange(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={!canGoToNext}
                className={cn(!canGoToNext && "pointer-events-none opacity-50")}
                onClick={(event) => {
                  event.preventDefault();
                  if (canGoToNext) {
                    onPageChange(currentPage + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContentUI>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationContent;
