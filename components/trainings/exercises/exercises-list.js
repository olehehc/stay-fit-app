"use client";

import ExerciseItem from "./exercise-item";

export default function ExercisesList({ exercises, setExercises, onDelete }) {
  function updateSet(exerciseId, setIndex, newValues) {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set, i) =>
                i === setIndex ? { ...set, ...newValues } : set
              ),
            }
          : exercise
      )
    );
  }

  return (
    <ul className="space-y-4 sm:space-y-6">
      {exercises.map((exercise) => (
        <ExerciseItem
          key={exercise.id}
          title={exercise.title}
          exerciseType={exercise.exercise_type}
          muscleGroup={exercise.muscle_group}
          exerciseId={exercise.id}
          sets={exercise.sets}
          onDelete={onDelete}
          updateSet={updateSet}
          setExercises={setExercises}
        />
      ))}
    </ul>
  );
}
