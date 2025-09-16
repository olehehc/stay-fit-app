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

export default function MuscleGroupDropdown({ name, defaultValue }) {
  const [value, setValue] = useState(defaultValue ?? "");

  const muscleGroups = [
    { value: "chest", label: "Chest" },
    { value: "back", label: "Back" },
    { value: "shoulders", label: "Shoulders" },
    { value: "biceps", label: "Biceps" },
    { value: "triceps", label: "Triceps" },
    { value: "legs", label: "Legs" },
    { value: "abs", label: "Abs" },
  ];

  const sortedMuscleGroups = [...muscleGroups].sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  return (
    <>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-full">
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
