import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getPageNumbers(currentPage, totalPages) {
  const pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (currentPage <= 4) {
    for (let i = 2; i <= 5; i++) pages.push(i);
    pages.push("ellipsis-right");
  } else if (currentPage >= totalPages - 3) {
    pages.push("ellipsis-left");
    for (let i = totalPages - 4; i <= totalPages - 1; i++) pages.push(i);
  } else {
    pages.push("ellipsis-left");
    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);
    pages.push("ellipsis-right");
  }

  pages.push(totalPages);

  return pages;
}
