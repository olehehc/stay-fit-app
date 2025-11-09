"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StatusFilterDropdown({
  name,
  value,
  setValue,
  className,
}) {
  const types = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  const sortedTypes = [...types].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className={`w-full ${className || ""}`}>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {sortedTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <input type="hidden" name={name} value={value} />
    </>
  );
}
