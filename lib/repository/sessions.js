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

export async function getTrainingSessionBySlug(trainingSlug, userId) {
  const training = db
    .prepare("SELECT * FROM trainings WHERE user_id = ? AND slug = ?")
    .get(userId, trainingSlug);

  if (training.user_id !== userId) {
    throw new Error(
      "You are not authorized to see these training session results"
    );
  }

  if (!training) {
    throw new Error("Training not found");
  }

  if (!training.completed) {
    throw new Error("The training is not completed yet");
  }

  const rows = db
    .prepare(
      `
      SELECT
        ts.id AS training_set_id,
        ts.training_id,
        ts.exercise_id,
        ts.set_order_index,
        ts.exercise_order_index,
        ts.reps,
        ts.weight,
        ts.rest,
        e.id AS ex_id,
        e.slug,
        e.title,
        e.exercise_type,
        e.muscle_group,
        e.image,
        e.instructions,
        e.user_id AS exercise_user_id,
        ps.id AS performed_set_id,
        ps.actual_reps,
        ps.actual_weight,
        ps.actual_rest,
        ps.performed_at
      FROM training_sets ts
      JOIN exercises e ON e.id = ts.exercise_id
      LEFT JOIN performed_sets ps ON ps.training_set_id = ts.id
      WHERE ts.training_id = ? AND e.user_id = ?
      ORDER BY ts.exercise_order_index ASC, ts.set_order_index ASC
      `
    )
    .all(training.id, userId);

  const exercises = [];
  const map = new Map();

  for (const r of rows) {
    const exId = r.exercise_id;
    if (!map.has(exId)) {
      const exObj = {
        id: r.ex_id,
        slug: r.slug,
        title: r.title,
        exercise_type: r.exercise_type,
        muscle_group: r.muscle_group,
        image: r.image,
        instructions: r.instructions,
        user_id: r.exercise_user_id,
        sets: [],
      };
      map.set(exId, exObj);
      exercises.push(exObj);
    }

    map.get(exId).sets.push({
      id: r.training_set_id,
      reps: r.reps,
      rest_period: r.rest / 60,
      weight: r.weight,
      performed: r.performed_set_id
        ? {
            id: r.performed_set_id,
            actual_reps: r.actual_reps,
            actual_weight: r.actual_weight,
            actual_rest_period: r.actual_rest / 60,
            performed_at: r.performed_at,
          }
        : null,
    });
  }

  return {
    id: training.id,
    title: training.title,
    training_date: training.training_date,
    exercises,
  };
}
