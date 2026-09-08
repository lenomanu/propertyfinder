"use client";

import { Button } from "@/components/ui/button";



type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function AgencyPagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="flex items-center justify-between text-sm">
      <p className="text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() =>
            onPageChange(page - 1)
          }
        >
          Previous
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() =>
            onPageChange(page + 1)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}