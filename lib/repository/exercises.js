"use server";

import xss from "xss";
import { S3 } from "@aws-sdk/client-s3";

import db from "../db";
import { generateUniqueSlug } from "../server-utils";

const s3 = new S3({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function getExercisesByUserId(userId) {
  return db.prepare("SELECT * FROM exercises WHERE user_id = ?").all(userId);
}

export async function saveExercise(exercise, userId) {
  exercise.slug = await generateUniqueSlug(exercise.title, "exercises");
  exercise.instructions = xss(exercise.instructions);

  const match = exercise.image.match(/^data:(.+);base64,(.*)$/);
  if (!match) {
    throw new Error("Invalid image format");
  }

  const mimeType = match[1];
  const base64Data = match[2];
  const extension = mimeType.split("/")[1];

  const fileName = `${exercise.slug}.${extension}`;

  const buffer = Buffer.from(base64Data, "base64");

  try {
    await s3.putObject({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: Buffer.from(buffer),
      ContentType: mimeType,
    });
  } catch (err) {
    throw new Error("Saving image failed!");
  }

  exercise.image = fileName;

  db.prepare(
    `
      INSERT INTO exercises
        (title, exercise_type, muscle_group, instructions, image, slug, user_id)
      VALUES (
        @title,
        @exercise_type,
        @muscle_group,
        @instructions,
        @image,
        @slug,
        @userId
      )
    `
  ).run({ ...exercise, userId });
}

export async function deleteExerciseByUserId(id, userId) {
  const exercise = db
    .prepare("SELECT image FROM exercises WHERE id = ? AND user_id = ?")
    .get(id, userId);

  if (!exercise) {
    return false;
  }

  const usage = db
    .prepare(
      `SELECT id FROM training_sets
       WHERE exercise_id = ?
       LIMIT 1`
    )
    .get(id);

  if (usage) {
    return {
      error: true,
      message:
        "This exercise is used in existing training sessions. Please delete those trainings first.",
    };
  }

  const result = db
    .prepare(
      `DELETE FROM exercises
       WHERE id = ? AND user_id = ?`
    )
    .run(id, userId);

  if (result.changes > 0 && exercise.image) {
    if (exercise.image) {
      try {
        await s3.deleteObject({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: exercise.image,
        });
      } catch (error) {
        console.error("Deleting image from S3 failed:", error);
      }
    }
  }

  return result.changes > 0;
}

export async function updateExerciseByUserId(id, userId, updatedData) {
  if (updatedData.instructions) {
    updatedData.instructions = xss(updatedData.instructions);
  }

  const currentExercise = db
    .prepare("SELECT * FROM exercises WHERE id = ? AND user_id = ?")
    .get(id, userId);

  if (!currentExercise) return false;

  let imageKey = currentExercise.image;

  if (updatedData.image && updatedData.image.startsWith("data:")) {
    const match = updatedData.image.match(/^data:(.+);base64,(.*)$/);
    if (!match) throw new Error("Invalid image format");

    const mimeType = match[1];
    const base64Data = match[2];
    const extension = mimeType.split("/")[1];
    const fileName = `${slug}_${Date.now()}.${extension}`;

    const buffer = Buffer.from(base64Data, "base64");

    try {
      await s3.putObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: mimeType,
      });

      if (currentExercise.image) {
        try {
          await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: currentExercise.image,
          });
        } catch (err) {
          console.warn("Warning: failed to delete old image from S3:", err);
        }
      }

      imageKey = fileName;
    } catch (err) {
      throw new Error("Uploading new image to S3 failed!");
    }
  }

  db.prepare(
    `
      UPDATE exercises
      SET
        title = @title,
        exercise_type = @exercise_type,
        muscle_group = @muscle_group,
        instructions = @instructions,
        image = @image
      WHERE id = @id AND user_id = @userId
    `
  ).run({
    id,
    userId,
    title: updatedData.title,
    exercise_type: updatedData.exercise_type,
    muscle_group: updatedData.muscle_group,
    instructions: updatedData.instructions,
    image: imageKey,
  });

  const updatedExercise = db
    .prepare("SELECT * FROM exercises WHERE id = ? AND user_id = ?")
    .get(id, userId);

  return updatedExercise;
}
