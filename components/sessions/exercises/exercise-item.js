"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import ExerciseCard from "@/components/trainings/exercises/exercise-card";
import SetsList from "./sets-list";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";

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
          />
        </Modal>
      )}
      <div className="bg-white rounded-md border shadow-sm w-3xl p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 items-center">
            <Button
              title={isExpanded ? "Hide sets" : "Show sets"}
              variant="link"
              size="icon"
              onClick={handleExpand}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Button>
            <h2 className="font-semibold">{title}</h2>
          </div>

          <div className="flex items-center">
            <Button
              variant="iconGhost"
              size="icon"
              onClick={() => setIsExerciseModalOpen(true)}
            >
              <InfoIcon />
            </Button>
          </div>
        </div>
        {isExpanded && (
          <SetsList
            sets={sets}
            exerciseId={exerciseId}
            toggleComplete={toggleComplete}
            updateSet={updateSet}
          />
        )}
      </div>
    </>
  );
}
