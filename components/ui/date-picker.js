"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateToYMD } from "@/lib/utils";

export default function DatePicker({ label, id, name, error }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(undefined);
  const labelId = `${id}-label`;

  return (
    <div className="flex flex-col gap-3">
      <Label
        id={labelId}
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {label}
      </Label>

      <input
        type="hidden"
        id={`${id}-hidden`}
        name={name}
        value={date ? formatDateToYMD(date) : ""}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            aria-labelledby={labelId}
            aria-expanded={open}
            className={`w-48 justify-between font-normal ${error ? error : ""}`}
          >
            {date ? formatDateToYMD(date) : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
