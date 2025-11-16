"use client";

import { useState } from "react";

import SetsList from "./sets-list";
import { Button } from "@/components/ui/button";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ExerciseItem({
  title,
  exerciseType,
  muscleGroup,
  exerciseId,
  sets,
  onDelete,
  setExercises,
  updateSet,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  function handleExpand() {
    setIsExpanded((prev) => !prev);
  }

  function addSet() {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  id: crypto.randomUUID(),
                  reps: 10,
                  weight: 0,
                  rest_period: 1,
                },
              ],
            }
          : exercise
      )
    );
  }

  function removeSet(setId) {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setId),
            }
          : exercise
      )
    );
  }

  return (
    <div className="bg-white rounded-md border shadow-sm p-4 space-y-3 sm:space-y-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      <div className="flex items-center justify-between gap-2 sm:gap-3 sm:flex-nowrap">
        <div className="flex items-start gap-2 sm:gap-3 min-w-0">
          <Button
            title={isExpanded ? "Hide sets" : "Show sets"}
            variant="link"
            size="icon"
            onClick={handleExpand}
            className="p-1 hidden sm:block"
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </Button>

          <div className="min-w-0">
            <h2 className="font-semibold text-base sm:text-lg md:text-xl truncate">
              {title}
            </h2>

            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
              <span>
                <span className="font-medium">Muscle:</span> {muscleGroup}
              </span>
              <span>
                <span className="font-medium">Type:</span> {exerciseType}
              </span>
            </div>
          </div>
        </div>
        <Button
          title="Delete training"
          variant="destructive"
          onClick={() => onDelete(exerciseId)}
          className="flex sm:flex-none h-9 sm:h-10 px-4 sm:px-5 text-sm sm:text-base font-medium"
        >
          <DeleteIcon fontSize="small" />
        </Button>
      </div>

      <div className="flex flex-row items-center px-10">
        <Button
          onClick={addSet}
          className="flex w-full sm:flex-none h-9 sm:h-10 px-4 sm:px-5 text-sm sm:text-base font-medium"
        >
          Add set
        </Button>
      </div>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-2 overflow-x-auto">
          <SetsList
            exerciseId={exerciseId}
            sets={sets}
            updateSet={updateSet}
            onDeleteSet={removeSet}
          />
        </div>
      </div>

      <div className="sm:hidden flex justify-center">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-600"
        >
          {isExpanded ? "Hide sets" : "Show sets"}
        </Button>
      </div>
    </div>
  );
}
