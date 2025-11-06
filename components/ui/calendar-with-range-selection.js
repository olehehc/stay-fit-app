import { Calendar } from "@/components/ui/calendar";
import { isValid } from "date-fns";

export function CalendarWithRangeSelection({ dateRange, setDateRange }) {
  const hasRange =
    dateRange &&
    dateRange.from &&
    dateRange.to &&
    isValid(new Date(dateRange.from)) &&
    isValid(new Date(dateRange.to));

  const selected = hasRange
    ? { from: dateRange.from, to: dateRange.to }
    : undefined;
  const defaultMonth = dateRange?.from ?? undefined;

  return (
    <Calendar
      mode="range"
      defaultMonth={defaultMonth}
      selected={selected}
      onSelect={setDateRange}
      className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)] shadow-sm"
    />
  );
}
