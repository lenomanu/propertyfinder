"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, Images, X } from "lucide-react";

export default function PropertyGallery({
  images,
  title,
  badge,
  sold = false,
}: {
  images: string[];
  title: string;
  badge?: string | null;
  sold?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const count = images.length;
  const current = images[index];

  useEffect(() => {
    if (!showAll) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setShowAll(false);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showAll]);

  function showPrevious() {
    setIndex((currentIndex) => (currentIndex - 1 + count) % count);
  }

  function showNext() {
    setIndex((currentIndex) => (currentIndex + 1) % count);
  }

  if (count === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-muted">
        <ImageIcon className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
        <img
          src={current}
          alt={title}
          className="h-full w-full object-cover"
        />

        {badge && (
          <span
            className={
              sold
                ? "absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-sm font-medium text-white shadow-sm"
                : "absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-medium shadow-sm"
            }
          >
            {badge}
          </span>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <span className="absolute bottom-4 left-4 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
          {index + 1}/{count}
        </span>

        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-md"
        >
          <Images className="h-4 w-4" />
          View all photos
        </button>
      </div>

      {count > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((url, imageIndex) => (
            <button
              key={`${url}-${imageIndex}`}
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-label={`Show photo ${imageIndex + 1}`}
              className={
                imageIndex === index
                  ? "h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-2 ring-black"
                  : "h-16 w-24 shrink-0 overflow-hidden rounded-lg opacity-70"
              }
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {showAll && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="All photos"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {images.map((url, imageIndex) => (
                <button
                  key={`${url}-all-${imageIndex}`}
                  type="button"
                  onClick={() => {
                    setIndex(imageIndex);
                    setShowAll(false);
                  }}
                  className="overflow-hidden rounded-xl"
                >
                  <img
                    src={url}
                    alt=""
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
