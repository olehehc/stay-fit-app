"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import ExerciseCard from "@/components/trainings/exercises/exercise-card";
import SetsList from "./sets-list";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import SetsProgress from "@/components/ui/sets-progress";

export default function ExerciseItem({
  title,
  exerciseType,
  muscleGroup,
  instructions,
  image,
  sets,
  exerciseId,
  toggleComplete,
  updateSet,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  function handleExpand() {
    setIsExpanded((prev) => !prev);
  }

  function handleClose() {
    setIsExerciseModalOpen(false);
  }

  return (
    <>
      {isExerciseModalOpen && (
        <Modal onClose={handleClose}>
          <ExerciseCard
            title={title}
            exerciseType={exerciseType}
            muscleGroup={muscleGroup}
            instructions={instructions}
            image={image}
            onClose={handleClose}
          />
        </Modal>
      )}

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
              <div className="flex flex-row gap-1 items-center">
                <h2 className="font-semibold text-base sm:text-lg md:text-xl truncate">
                  {title}
                </h2>
                <Button
                  variant="iconGhost"
                  size="icon"
                  onClick={() => setIsExerciseModalOpen(true)}
                  aria-label={`Open ${title} info`}
                  className="p-2 sm:p-1"
                >
                  <InfoIcon fontSize="small" />
                </Button>
              </div>

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

          <SetsProgress
            done={sets.filter((s) => s.completed).length}
            total={sets.length}
          />
        </div>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-2 overflow-x-auto">
            <SetsList
              sets={sets}
              exerciseId={exerciseId}
              toggleComplete={toggleComplete}
              updateSet={updateSet}
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
    </>
  );
}
