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

  const slug = await generateUniqueSlug(data.title);

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

export function getTrainingsByUserId(userId) {
  return db.prepare("SELECT * FROM trainings WHERE user_id = ?").all(userId);
}

export function deleteTrainingByUserId(id, userId) {
  const deletePerformedSets = db.prepare(`
    DELETE FROM performed_sets
    WHERE training_set_id IN (
      SELECT ts.id
      FROM training_sets ts
      JOIN trainings t ON ts.training_id = t.id
      WHERE t.id = ? AND t.user_id = ?
    )
  `);

  const deleteTrainingSets = db.prepare(`
    DELETE FROM training_sets
    WHERE id IN (
      SELECT ts.id
      FROM training_sets ts
      JOIN trainings t ON ts.training_id = t.id
      WHERE t.id = ? AND t.user_id = ?
    )
  `);

  const deleteTraining = db.prepare(`
    DELETE FROM trainings
    WHERE id = ? AND user_id = ?
  `);

  const transaction = db.transaction(() => {
    deletePerformedSets.run(id, userId);

    deleteTrainingSets.run(id, userId);

    const result = deleteTraining.run(id, userId);

    return result.changes;
  });

  return transaction();
}
