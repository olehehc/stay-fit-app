"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDateToYMD } from "@/lib/utils";
import { NextSevenDaysSwitch } from "./next-seven-days-switch";
import { AllDaysSwitch } from "./all-days-switch";
import { CalendarWithRangeSelection } from "../ui/calendar-with-range-selection";
import { addDays, isValid, parseISO, startOfDay } from "date-fns";
import StatusFilterDropdown from "./status-filter-dropdown";

export default function ClientFilters({ defaultRange }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [dateRange, setDateRangeState] = useState({
    from: null,
    to: null,
  });

  const [statusValue, setStatusValue] = useState("all");

  useEffect(() => {
    const todayLocal = startOfDay(new Date());
    const nextWeekLocal = addDays(todayLocal, 6);

    const urlFrom = searchParams.get("dateFrom");
    const urlTo = searchParams.get("dateTo");

    if (!urlFrom && !urlTo) {
      if (defaultRange?.from || defaultRange?.to) {
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

      setDateRangeState({ from: null, to: null });
      return;
    }

    if (urlFrom || urlTo) {
      const from =
        urlFrom && isValid(parseISO(urlFrom))
          ? startOfDay(parseISO(urlFrom))
          : todayLocal;
      const to =
        urlTo && isValid(parseISO(urlTo))
          ? startOfDay(parseISO(urlTo))
          : nextWeekLocal;
      setDateRangeState({ from, to });
      return;
    }
  }, [searchParams, defaultRange]);

  function handleRangeChange(newRange) {
    const normalized = newRange || { from: null, to: null };
    setDateRangeState(normalized);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      if (!normalized.from && !normalized.to) {
        params.delete("dateFrom");
        params.delete("dateTo");
      } else {
        if (normalized.from)
          params.set("dateFrom", formatDateToYMD(normalized.from));
        else params.delete("dateFrom");

        if (normalized.to) params.set("dateTo", formatDateToYMD(normalized.to));
        else params.delete("dateTo");
      }

      router.push(`/trainings?${params.toString()}`);
    });
  }

  function handleStatusChange(status) {
    setStatusValue(status);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      if (status === "all") {
        params.delete("status");
      } else {
        params.set("status", status);
      }

      router.push(`/trainings?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="mb-2 text-sm font-medium text-gray-600">Status</p>
        <StatusFilterDropdown
          value={statusValue}
          setValue={handleStatusChange}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="mb-2 text-sm font-medium text-gray-600">Timeline</p>
        <div className="flex gap-2 mb-3">
          <AllDaysSwitch
            dateRange={dateRange}
            setDateRange={handleRangeChange}
          />
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
    </div>
  );
}
