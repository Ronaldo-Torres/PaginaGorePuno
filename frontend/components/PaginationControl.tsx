import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlProps {
  totalItems: number;
  currentPage: number;
  rowsPerPage: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const PaginationControl: React.FC<PaginationControlProps> = ({
  totalItems,
  currentPage,
  rowsPerPage,
  isLoading = false,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  let startPage = 0;
  let endPage = totalPages;
  if (totalPages > 5) {
    startPage = Math.max(0, currentPage - 2);
    endPage = startPage + 5;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - 5;
    }
  }
  const pageNumbers = Array.from(
    { length: endPage - startPage },
    (_, i) => i + startPage
  );

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">{totalItems} total</div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Ver</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value: string) => {
              onRowsPerPageChange(Number(value));
              onPageChange(0);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={rowsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                size="default"
                onClick={handlePrevious}
                isActive={currentPage === 0}
              />
            </PaginationItem>
            {pageNumbers.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  size="default"
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {totalPages > 5 && endPage < totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                size="default"
                onClick={handleNext}
                isActive={currentPage === totalPages - 1 || isLoading}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationControl;
