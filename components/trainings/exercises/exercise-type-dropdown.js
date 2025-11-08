"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ExerciseTypeDropdown({
  name,
  defaultValue,
  className,
}) {
  const [value, setValue] = useState(defaultValue ?? "");

  const types = [
    { value: "Strength", label: "Strength" },
    { value: "Cardio", label: "Cardio" },
    { value: "Stretching", label: "Stretching" },
  ];

  const sortedTypes = [...types].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className={`w-full ${className || ""}`}>
          <SelectValue placeholder="Select exercise type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Exercise types</SelectLabel>
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
