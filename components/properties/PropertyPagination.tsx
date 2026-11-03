"use client";

import {
  useQueryState,
} from "nuqs";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { propertySearchParams } from "@/lib/properties/property-search-params";

type PropertyPaginationProps = {
  totalPages: number;
};

export default function PropertyPagination({
  totalPages,
}: PropertyPaginationProps) {
const [page, setPage] = useQueryState(
  "page",
  {
    ...propertySearchParams.page,
    shallow: false,
    history: "push",
    scroll: true,
  }
);

  if (totalPages <= 1) return null;

  const currentPage = Math.min(
    Math.max(1, page),
    totalPages
  );

  // Generate visible page numbers
  function getPages(): (number | "ellipsis")[] {
    const pages: (number | "ellipsis")[] = [];

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);

    if (start > 2) {
      pages.push("ellipsis");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("ellipsis");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  async function changePage(newPage: number) {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === currentPage
    ) {
      return;
    }

    await setPage(newPage);
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>

        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-label="Go to previous page"
            aria-disabled={currentPage <= 1}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={(e) => {
              e.preventDefault();
              changePage(currentPage - 1);
            }}
          />
        </PaginationItem>

        {/* Page numbers */}
        {getPages().map((item, index) => (
          <PaginationItem key={`${item}-${index}`}>
            {item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={`?page=${item}`}
                isActive={currentPage === item}
                aria-label={`Go to page ${item}`}
                aria-current={
                  currentPage === item ? "page" : undefined
                }
                onClick={(e) => {
                  e.preventDefault();
                  changePage(item);
                }}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-label="Go to next page"
            aria-disabled={currentPage >= totalPages}
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={(e) => {
              e.preventDefault();
              changePage(currentPage + 1);
            }}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
}
