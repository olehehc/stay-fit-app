"use client";

import { NumericInput } from "@/components/ui/numeric-input";
import { InputWithAddon } from "@/components/ui/input-with-addon";
import { Button } from "@/components/ui/button";

export default function SetItem({
  id,
  reps,
  weight,
  rest_period,
  exerciseId,
  updateSet,
  onDelete,
  setsNumber,
}) {
  const handleNumberChange = (e, field, min = 0) => {
    let raw = e.target.value.replace(",", ".");
    if (raw === "") {
      updateSet(exerciseId, id, { [field]: "0" });
      return;
    }
    if (/^0\d+$/.test(raw)) raw = raw.replace(/^0+/, "");
    if (/^\d*\.?\d*$/.test(raw)) updateSet(exerciseId, id, { [field]: raw });
  };

  return (
    <div className={"w-full rounded-md border p-3 sm:p-4 shadow-sm bg-white"}>
      {/* ----- Desktop layout (lg and up) ----- */}
      <div className="hidden lg:flex flex-row items-center justify-between gap-3">
        <div className="flex gap-2 items-center">
          <p>Reps</p>
          <NumericInput
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            value={reps}
            min={1}
            max={50}
            className="h-8 w-16"
            onChange={(e) => handleNumberChange(e, "reps")}
          />
        </div>

        <div className="flex gap-2 items-center">
          <p>Weight</p>
          <InputWithAddon
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            value={weight}
            step={1}
            min={0}
            onChange={(e) => handleNumberChange(e, "weight")}
            addon="kg"
          />
        </div>

        <div className="flex gap-2 items-center">
          <p>Rest</p>
          <InputWithAddon
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            value={rest_period}
            step={0.5}
            min={0}
            onChange={(e) => handleNumberChange(e, "rest_period")}
            addon="min"
          />
        </div>

        <Button onClick={() => onDelete(id)} disabled={setsNumber <= 1}>
          Delete
        </Button>
      </div>

      {/* ----- Mobile layout (< lg) ----- */}
      <div className="flex flex-col lg:hidden gap-3">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm text-gray-700">Reps</p>
          <NumericInput
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            value={reps}
            min={1}
            max={50}
            className="h-8 w-28"
            onChange={(e) => handleNumberChange(e, "reps")}
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm text-gray-700">Weight</p>
          <InputWithAddon
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            value={weight}
            step={1}
            min={0}
            onChange={(e) => handleNumberChange(e, "weight")}
            addon="kg"
            className="w-28"
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm text-gray-700">Rest</p>
          <InputWithAddon
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            value={rest_period}
            step={0.5}
            min={0}
            onChange={(e) => handleNumberChange(e, "rest_period")}
            addon="min"
            className="w-28"
          />
        </div>

        <Button onClick={() => onDelete(id)} disabled={setsNumber <= 1}>
          Delete
        </Button>
      </div>
    </div>
  );
}
