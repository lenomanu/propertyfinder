"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { usePathname, useRouter } from "next/navigation";


import { AgencyTable } from "./agency-table";
import { AgencyForm } from "./agency-form";
import { AgencySearch } from "./agency-search";
import { AgencyPagination } from "./agency-pagination";
import { Agency } from "./agency-types";


type Props = {
  // Only the current page's rows — the full set may be
  // 1000+ agencies, so we never hold all of them at once.
  agencies: Agency[];
  page: number;
  totalPages: number;
  search: string;
};

export function AgenciesManager({
  agencies,
  page,
  totalPages,
  search,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] =
    useTransition();

  // ----------------------------------------
  // Search (debounced navigation)
  // ----------------------------------------

  const [searchInput, setSearchInput] =
    useState(search);

  const isFirstRender = useRef(true);

  function navigate(
    nextSearch: string,
    nextPage: number
  ) {
    const params = new URLSearchParams();

    if (nextSearch) {
      params.set("search", nextSearch);
    }

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    }

    const query = params.toString();

    startTransition(() => {
      router.push(
        query
          ? `${pathname}?${query}`
          : pathname
      );
    });
  }

  useEffect(() => {
    // Skip firing a navigation for the initial render —
    // only react to the admin actually typing.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handle = setTimeout(() => {
      // A new search always jumps back to page 1.
      navigate(searchInput, 1);
    }, 300);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const goToPage = (nextPage: number) => {
    navigate(searchInput, nextPage);
  };


  // ----------------------------------------
  // Selection
  // ----------------------------------------

  // Store only the ID of the selected agency.
  const [selectedId, setSelectedId] =
    useState<string | null>(
      agencies[0]?.id ?? null
    );

  // If the page changes (new search or new page) and the
  // previous selection isn't in the new set, fall back to
  // the first row rather than leaving a stale selection.
  useEffect(() => {
    if (
      !agencies.some(
        (agency) => agency.id === selectedId
      )
    ) {
      setSelectedId(agencies[0]?.id ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencies]);

  const selectedAgency =
    agencies.find(
      (agency) => agency.id === selectedId
    ) ?? null;

  return (
    <div
      className={`space-y-4 transition-opacity ${
        isPending ? "opacity-60" : ""
      }`}
    >

      {/* -------------------------------- */}
      {/* Search */}
      {/* -------------------------------- */}

      <AgencySearch
        value={searchInput}
        onChange={setSearchInput}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">

        {/* -------------------------------- */}
        {/* Agencies table + pagination */}
        {/* -------------------------------- */}

        <div className="space-y-4">
          <AgencyTable
            agencies={agencies}
            selectedId={selectedId}
            onSelect={(agency) => {
              setSelectedId(agency.id);
            }}
          />

          <AgencyPagination
            page={page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>

        {/* -------------------------------- */}
        {/* Agency details */}
        {/* -------------------------------- */}

        <AgencyForm agency={selectedAgency} />

      </div>
    </div>
  );
}