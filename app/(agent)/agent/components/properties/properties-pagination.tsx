"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PropertiesPaginationProps = {
  currentPage: number;
  totalPages: number;
};

function createPageNumbers(
  currentPage: number,
  totalPages: number,
) {
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(
    totalPages - 1,
    currentPage + 1,
  );

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

export default function PropertiesPagination({
  currentPage,
  totalPages,
}: PropertiesPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  function createPageUrl(page: number) {
    const params = new URLSearchParams(
      window.location.search,
    );

    params.set("page", page.toString());

    return `?${params.toString()}`;
  }

  const pages = createPageNumbers(
    currentPage,
    totalPages,
  );

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-muted-foreground text-sm">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          asChild={currentPage !== 1}
        >
          {currentPage === 1 ? (
            <span>
              <ChevronLeft className="size-4" />
            </span>
          ) : (
            <Link
              href={createPageUrl(
                currentPage - 1,
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Link>
          )}
        </Button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={
                page === currentPage
                  ? "default"
                  : "outline"
              }
              size="icon"
              asChild={page !== currentPage}
            >
              {page === currentPage ? (
                <span>{page}</span>
              ) : (
                <Link href={createPageUrl(page)}>
                  {page}
                </Link>
              )}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          asChild={currentPage !== totalPages}
        >
          {currentPage === totalPages ? (
            <span>
              <ChevronRight className="size-4" />
            </span>
          ) : (
            <Link
              href={createPageUrl(
                currentPage + 1,
              )}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
}