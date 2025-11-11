"use client";

import ExerciseItem from "./exercise-item";

export default function ExercisesList({ training, toggleComplete, updateSet }) {
  return (
    <ul className="space-y-4 sm:space-y-6">
      {training.exercises.map((exercise) => (
        <ExerciseItem
          key={exercise.id}
          title={exercise.title}
          exerciseType={exercise.exercise_type}
          muscleGroup={exercise.muscle_group}
          instructions={exercise.instructions}
          image={exercise.image}
          exerciseId={exercise.id}
          sets={exercise.sets}
          toggleComplete={toggleComplete}
          updateSet={updateSet}
        />
      ))}
    </ul>
  );
}
