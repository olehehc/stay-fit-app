"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDateToYMD } from "@/lib/utils";
import { SwitchWithLabel } from "../ui/switch-with-label";
import { CalendarWithRangeSelection } from "../ui/calendar-with-range-selection";
import { addDays, isValid } from "date-fns";

export default function ClientFilters({ defaultRange }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const today = new Date();
  const nextWeek = addDays(today, 7);

  const [dateRange, setDateRange] = useState({
    from: today,
    to: nextWeek,
  });

  useEffect(() => {
    const today = new Date();
    const nextWeek = addDays(today, 7);

    const urlFrom = searchParams.get("dateFrom");
    const urlTo = searchParams.get("dateTo");

    if (!urlFrom && !urlTo) {
      startTransition(() => {
        const params = new URLSearchParams();
        params.append("dateFrom", formatDateToYMD(today));
        params.append("dateTo", formatDateToYMD(nextWeek));
        router.replace(`/trainings?${params.toString()}`);
      });
    } else {
      const from =
        urlFrom && isValid(new Date(urlFrom)) ? new Date(urlFrom) : today;
      const to = urlTo && isValid(new Date(urlTo)) ? new Date(urlTo) : nextWeek;
      setDateRange({ from, to });
    }
  }, [searchParams, router]);

  function handleRangeChange(newRange) {
    setDateRange(newRange);

    const from = newRange?.from ? formatDateToYMD(newRange.from) : null;
    const to = newRange?.to ? formatDateToYMD(newRange.to) : from;

    startTransition(() => {
      const params = new URLSearchParams();
      if (from) params.append("dateFrom", from);
      if (to) params.append("dateTo", to);

      router.push(`/trainings?${params.toString()}`);
    });
  }

  return (
    <>
      <SwitchWithLabel
        dateRange={dateRange}
        setDateRange={handleRangeChange}
        today={today}
        nextWeek={nextWeek}
      >
        Next 7 days
      </SwitchWithLabel>

      <div className="flex-1 min-h-0 max-h-[calc(100vh-92px-1.5rem)] overflow-hidden">
        <CalendarWithRangeSelection
          dateRange={dateRange}
          setDateRange={handleRangeChange}
        />
      </div>
    </>
  );
}
