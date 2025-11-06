"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDateToYMD } from "@/lib/utils";
import { NextSevenDaysSwitch } from "./next-seven-days-switch";
import { AllDaysSwitch } from "./all-days-switch";
import { CalendarWithRangeSelection } from "../ui/calendar-with-range-selection";
import { addDays, isValid, parseISO, startOfDay } from "date-fns";

export default function ClientFilters({ defaultRange }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [dateRange, setDateRangeState] = useState({
    from: null,
    to: null,
  });

  useEffect(() => {
    const todayLocal = startOfDay(new Date());
    const nextWeekLocal = addDays(todayLocal, 6);

    const urlFrom = searchParams.get("dateFrom");
    const urlTo = searchParams.get("dateTo");

    if (searchParams.size === 0) {
      setDateRangeState({ from: null, to: null });
      return;
    }

    if (!urlFrom && !urlTo && defaultRange) {
      try {
        const parsedFrom = defaultRange.from
          ? startOfDay(parseISO(defaultRange.from))
          : null;
        const parsedTo = defaultRange.to
          ? startOfDay(parseISO(defaultRange.to))
          : null;
        if (
          parsedFrom &&
          parsedTo &&
          isValid(parsedFrom) &&
          isValid(parsedTo)
        ) {
          setDateRangeState({ from: parsedFrom, to: parsedTo });
          return;
        }
      } catch (e) {}
    }

    if (urlFrom || urlTo) {
      const from =
        urlFrom && isValid(new Date(urlFrom))
          ? startOfDay(new Date(urlFrom))
          : todayLocal;
      const to =
        urlTo && isValid(new Date(urlTo))
          ? startOfDay(new Date(urlTo))
          : nextWeekLocal;
      setDateRangeState({ from, to });
      return;
    }

    setDateRangeState({ from: todayLocal, to: nextWeekLocal });
  }, [searchParams, router, defaultRange]);

  function handleRangeChange(newRange) {
    const normalized = newRange || { from: null, to: null };
    setDateRangeState(normalized);

    startTransition(() => {
      if (!normalized.from && !normalized.to) {
        router.push("/trainings");
        return;
      }

      const params = new URLSearchParams();
      if (normalized.from)
        params.set("dateFrom", formatDateToYMD(normalized.from));
      if (normalized.to) params.set("dateTo", formatDateToYMD(normalized.to));
      router.push(`/trainings?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex">
        <AllDaysSwitch dateRange={dateRange} setDateRange={handleRangeChange} />

        <NextSevenDaysSwitch
          dateRange={dateRange}
          setDateRange={handleRangeChange}
        />
      </div>

      <div className="flex-1 min-h-0 max-h-[calc(100vh-92px-1.5rem)] overflow-hidden">
        <CalendarWithRangeSelection
          dateRange={dateRange}
          setDateRange={handleRangeChange}
        />
      </div>
    </div>
  );
}
