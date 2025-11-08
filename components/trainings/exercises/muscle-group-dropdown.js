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

export default function MuscleGroupDropdown({ name, defaultValue, className }) {
  const [value, setValue] = useState(defaultValue ?? "");

  const muscleGroups = [
    { value: "Chest", label: "Chest" },
    { value: "Back", label: "Back" },
    { value: "Shoulders", label: "Shoulders" },
    { value: "Biceps", label: "Biceps" },
    { value: "Triceps", label: "Triceps" },
    { value: "Legs", label: "Legs" },
    { value: "Abs", label: "Abs" },
  ];

  const sortedMuscleGroups = [...muscleGroups].sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  return (
    <>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className={`w-full ${className || ""}`}>
          <SelectValue placeholder="Select muscle group"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Muscle Group</SelectLabel>
            {sortedMuscleGroups.map((type) => (
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
