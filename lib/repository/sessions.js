"use server";

import db from "../db";

export async function saveTrainingSession(trainingSession, userId) {
  const training = db
    .prepare("SELECT user_id, completed FROM trainings WHERE id = ?")
    .get(trainingSession.id);

  if (!training) {
    throw new Error("Training not found");
  }

  if (training.user_id !== userId) {
    throw new Error("You are not authorized to save this training session");
  }

  if (training.completed) {
    throw new Error("This training session has already been completed");
  }

  const insertPerformedSet = db.prepare(`
    INSERT INTO performed_sets (training_set_id, actual_reps, actual_weight, actual_rest)
    VALUES (?, ?, ?, ?)
  `);

  const markTrainingCompleted = db.prepare(`
    UPDATE trainings
    SET completed = 1
    WHERE id = ?
  `);

  const transaction = db.transaction(() => {
    trainingSession.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        insertPerformedSet.run(
          set.id,
          set.reps,
          set.weight,
          Math.floor(set.rest_period * 60)
        );
      });
    });

    markTrainingCompleted.run(trainingSession.id);
  });

  transaction();
}
