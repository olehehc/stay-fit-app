"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import ClientFilters from "./client-filters";

export default function TrainingsSidebar({ from, to }) {
  const [open, setOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (isLargeScreen && open) {
      requestAnimationFrame(() => setOpen(false));
    }
  }, [isLargeScreen, open]);

  return (
    <div className="w-full lg:w-auto">
      <div className="fixed top-[68px] left-0 w-full z-50 bg-white p-4 flex justify-between items-center lg:hidden shadow-md">
        <Button asChild size="sm">
          <Link href="/trainings/create-training">Add training</Link>
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <SlidersHorizontal size={16} />
              Filters
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="bg-gray-50 w-[85vw] border-l border-gray-200 p-6 flex flex-col items-center"
          >
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold text-gray-900">
                Filters
              </SheetTitle>
            </SheetHeader>

            <ClientFilters defaultRange={{ from, to }} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:flex flex-col p-6 gap-6 items-start h-full">
        <Button asChild className="w-auto">
          <Link href="/trainings/create-training">Add training</Link>
        </Button>
        <ClientFilters
          defaultRange={{ from, to }}
          calendarCellSizeSpacing="lg:[--cell-size:--spacing(12)]"
        />
      </div>
    </div>
  );
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
