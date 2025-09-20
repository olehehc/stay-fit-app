import { useState } from "react";

import { Textarea } from "./textarea";

export default function TextAreaWithCounter({
  children,
  state,
  maxChars,
  maxVH,
  defaultValue = "",
}) {
  const [value, setValue] = useState(
    state.data?.instructions || defaultValue || ""
  );

  const maxHeightClass =
    {
      25: "max-h-[25vh]",
      50: "max-h-[50vh]",
      75: "max-h-[75vh]",
    }[maxVH] || "max-h-[50vh]";

  return (
    <>
      <Textarea
        id="instructions"
        name="instructions"
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, maxChars))}
        className={`${maxHeightClass} ${
          state.errors?.instructions ? "border-destructive" : ""
        }`}
      />
      <div className="flex justify-between items-center mt-1">
        <div className="flex-1">{children}</div>
        <p
          className={`text-xs ${
            state.errors?.instructions
              ? "text-destructive"
              : "text-muted-foreground"
          }`}
        >
          {value.length}/{maxChars}
        </p>
      </div>
    </>
  );
}
