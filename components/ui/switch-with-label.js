import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { isSameDay, isValid } from "date-fns";

export function SwitchWithLabel({
  children,
  dateRange = { from: null, to: null },
  setDateRange,
  today,
  nextWeek,
}) {
  const from = dateRange?.from ? new Date(dateRange.from) : null;
  const to = dateRange?.to ? new Date(dateRange.to) : null;

  const isChecked =
    from &&
    to &&
    isValid(from) &&
    isValid(to) &&
    isSameDay(from, today) &&
    isSameDay(to, nextWeek);

  function handleChange(checked) {
    if (checked) {
      setDateRange({ from: today, to: nextWeek });
    } else {
      setDateRange({ from: today, to: today });
    }
  }

  return (
    <div className="flex items-center space-x-2 h-9">
      <Switch
        id={`${children}-mode`}
        checked={isChecked}
        onCheckedChange={handleChange}
      />
      <Label htmlFor={`${children}-mode`}>{children}</Label>
    </div>
  );
}
