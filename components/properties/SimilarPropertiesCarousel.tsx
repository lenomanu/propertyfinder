"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SimilarPropertiesCarousel({
  children,
}: {
  children: ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    const viewport = scrollRef.current;
    if (!viewport) return;

    viewport.scrollBy({
      left: direction * Math.max(viewport.clientWidth * 0.8, 260),
      behavior: "smooth",
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Similar properties</h2>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Scroll to previous similar properties"
            onClick={() => scroll(-1)}
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Scroll to next similar properties"
            onClick={() => scroll(1)}
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="scrollbar-hide flex touch-pan-x gap-4 overflow-x-auto overscroll-x-contain pb-2"
        aria-label="Similar property listings"
      >
        {children}
      </div>
    </div>
  );
}
