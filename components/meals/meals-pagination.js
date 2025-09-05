"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { getPageNumbers } from "@/lib/utils";

export default function MealsPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  }

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToPage(currentPage - 1);
            }}
          />
        </PaginationItem>

        {getPageNumbers(currentPage, totalPages).map((page, i) => (
          <PaginationItem key={i}>
            {page === "ellipsis-left" || page === "ellipsis-right" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(page);
                }}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
