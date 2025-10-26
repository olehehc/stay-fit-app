"use client";

import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import ExercisesList from "../exercises/exercises-list";
import { saveTrainingSession as saveTrainingSessionOnServer } from "@/lib/repository/sessions";
import LoadingDots from "@/components/ui/loading-dots";

export default function TrainingSession({ training, userId }) {
  const [trainingSession, setTrainingSession] = useState(() => ({
    ...training,
    exercises: training.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) => ({
        ...set,
        completed: !!set.completed,
      })),
    })),
  }));
  const [completeTrainingWarning, setCompleteTrainingWarning] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const allCompleted = useMemo(() => {
    if (!trainingSession.exercises || trainingSession.exercises.length === 0)
      return false;

    return trainingSession.exercises.every((exercise) =>
      exercise.sets && exercise.sets.length > 0
        ? exercise.sets.every((set) => !!set.completed)
        : false
    );
  }, [trainingSession]);

  async function handleCompleteTraining() {
    if (!allCompleted) {
      setCompleteTrainingWarning(true);
      return;
    }

    setCompleteTrainingWarning(false);
    setErrorMessage("");
    setIsPending(true);

    try {
      await saveTrainingSessionOnServer(trainingSession, userId);
      console.log("Training session saved");
    } catch (error) {
      setErrorMessage(
        error.message ||
          "An unexpected error occurred while saving your training session."
      );
    } finally {
      setIsPending(false);
    }
  }

  function toggleComplete(exerciseId, setId) {
    setTrainingSession((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, completed: !set.completed } : set
              ),
            }
          : exercise
      ),
    }));
  }

  function updateSet(exerciseId, setId, newValues) {
    setTrainingSession((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, ...newValues } : set
              ),
            }
          : exercise
      ),
    }));
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">{trainingSession.title}</h1>
      <ExercisesList
        training={trainingSession}
        toggleComplete={toggleComplete}
        updateSet={updateSet}
      />
      <div className="flex flex-col items-center gap-3 mt-6">
        <Button onClick={handleCompleteTraining} disabled={isPending}>
          {isPending ? <LoadingDots /> : "Finish Training"}
        </Button>
        {completeTrainingWarning && (
          <p className="text-red-600 text-sm text-center max-w-md">
            There are uncompleted sets. Please complete all sets and press
            <span className="font-semibold"> Finish Training </span> button
            again.
          </p>
        )}
        {errorMessage && (
          <p className="text-red-600 text-sm text-center max-w-md">
            ⚠️ {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
