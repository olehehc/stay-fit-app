"use server";

import db from "../db";
import { generateUniqueSlug } from "../server-utils";

export async function saveTraining(data, userId) {
  const insertTraining = db.prepare(`
    INSERT INTO trainings (slug, title, training_date, user_id)
    VALUES (?, ?, ?, ?)
  `);

  const insertTrainingSet = db.prepare(`
    INSERT INTO training_sets (
      training_id,
      exercise_id,
      set_order_index,
      exercise_order_index,
      reps,
      weight,
      rest
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const slug = await generateUniqueSlug(data.title, "trainings");

  const transaction = db.transaction(() => {
    const trainingResult = insertTraining.run(
      slug,
      data.title,
      data.training_date,
      userId
    );
    const trainingId = trainingResult.lastInsertRowid;

    data.training.forEach((exercise, exIndex) => {
      exercise.sets.forEach((set, setIndex) => {
        insertTrainingSet.run(
          trainingId,
          exercise.id,
          setIndex,
          exIndex,
          set.reps,
          set.weight,
          Math.floor(set.rest_period * 60)
        );
      });
    });

    return trainingId;
  });

  return transaction();
}

export async function updateTraining(trainingId, data, userId) {
  const updateTraining = db.prepare(`
    UPDATE trainings
    SET slug = ?, title = ?, training_date = ?
    WHERE id = ? AND user_id = ?
  `);

  const deleteOldSets = db.prepare(`
    DELETE FROM training_sets
    WHERE training_id = ?
  `);

  const insertTrainingSet = db.prepare(`
    INSERT INTO training_sets (
      training_id,
      exercise_id,
      set_order_index,
      exercise_order_index,
      reps,
      weight,
      rest
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const slug = await generateUniqueSlug(data.title, "trainings");

  const transaction = db.transaction(() => {
    updateTraining.run(
      slug,
      data.title,
      data.training_date,
      trainingId,
      userId
    );

    deleteOldSets.run(trainingId);

    data.training.forEach((exercise, exIndex) => {
      exercise.sets.forEach((set, setIndex) => {
        insertTrainingSet.run(
          trainingId,
          exercise.id,
          setIndex,
          exIndex,
          set.reps,
          set.weight,
          Math.floor(set.rest_period * 60)
        );
      });
    });

    return trainingId;
  });

  return transaction();
}

export async function getTrainingsByUserAndDateRange(userId, dateFrom, dateTo) {
  let query = "SELECT * FROM trainings WHERE user_id = ?";
  const params = [userId];

  if (dateFrom) {
    query += "AND training_date >= ?";
    params.push(dateFrom);
  }

  if (dateTo) {
    query += "AND training_date <= ?";
    params.push(dateTo);
  }

  return db.prepare(query).all(...params);
}

export async function getTrainingAndTrainingSetsBySlug(trainingSlug, userId) {
  const training = db
    .prepare("SELECT * FROM trainings WHERE user_id = ? AND slug = ?")
    .get(userId, trainingSlug);

  if (!training) return null;

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
      e.user_id AS exercise_user_id
    FROM training_sets ts
    JOIN exercises e ON e.id = ts.exercise_id
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
    });
  }

  return {
    id: training.id,
    title: training.title,
    training_date: training.training_date,
    completed: Boolean(training.completed),
    exercises: exercises,
  };
}

export async function deleteTrainingBySlug(trainingSlug, userId) {
  const training = db
    .prepare("SELECT id FROM trainings WHERE user_id = ? AND slug = ?")
    .get(userId, trainingSlug);

  if (!training) return 0;

  const deleteTraining = db.prepare(`
    DELETE FROM trainings
    WHERE id = ? AND user_id = ?
  `);

  const transaction = db.transaction(() => {
    const result = deleteTraining.run(training.id, userId);
    return result.changes;
  });

  return transaction();
}
