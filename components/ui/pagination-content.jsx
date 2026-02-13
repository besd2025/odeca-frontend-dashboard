import React, { useState } from "react";
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
  return (
    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 sm:px-6 w-full">
      <div className="flex items-center justify-between flex-col sm:flex-row">
        <div className="mb-4 sm:mb-0">
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Affichage de{" "}
            <span className="font-medium">
              {totalCount === 0 ? 0 : pointer + 1}
            </span>{" "}
            à{" "}
            <span className="font-medium">
              {Math.min(actualPointer + actualLimit, totalCount)}
            </span>
            sur <span className="font-medium">{totalCount}</span> résultats
          </p>
        </div>

        <div className="flex flex-row gap-x-3 items-center mb-4 sm:mb-0">
          <div className="relative">
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
        </div>

        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-white/[0.03] dark:text-gray-400 disabled:opacity-50"
          >
            Précédent
          </button>

          {pagesToShow.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                page === currentPage
                  ? "bg-indigo-50 text-indigo-600 border-gray-300"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 dark:bg-white/[0.03] dark:text-gray-400"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-white/[0.03] dark:text-gray-400 disabled:opacity-50"
          >
            Suivant
          </button>
        </nav>
      </div>
    </div>
  );
};

export default PaginationContent;
