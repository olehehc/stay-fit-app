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

export default function ExerciseTypeDropdown({ name, defaultValue }) {
  const [value, setValue] = useState(defaultValue ?? "");

  const types = [
    { value: "strength", label: "Strength" },
    { value: "cardio", label: "Cardio" },
    { value: "stretching", label: "Stretching" },
  ];

  const sortedTypes = [...types].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select exercise type"></SelectValue>
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
