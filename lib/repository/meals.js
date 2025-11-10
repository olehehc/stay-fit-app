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

export async function getMeals(userId) {
  return db
    .prepare(
      `
      SELECT
        meals.*,
        users.username,
        CASE
          WHEN meal_favorites.id IS NOT NULL THEN 1
          ELSE 0
        END AS is_favorite
      FROM meals
      JOIN users ON meals.user_id = users.id
      LEFT JOIN meal_favorites
        ON meals.id = meal_favorites.meal_id
        AND meal_favorites.user_id = ?
    `
    )
    .all(userId)
    .map((meal) => ({
      ...meal,
      is_favorite: Boolean(meal.is_favorite),
    }));
}

export async function getMeal(slug, userId) {
  const meal = db
    .prepare(
      `
      SELECT
        meals.*,
        users.username,
        CASE
          WHEN meal_favorites.id IS NOT NULL THEN 1
          ELSE 0
        END AS is_favorite
      FROM meals
      JOIN users ON meals.user_id = users.id
      LEFT JOIN meal_favorites
        ON meals.id = meal_favorites.meal_id
        AND meal_favorites.user_id = ?
      WHERE meals.slug = ?
    `
    )
    .get(userId, slug);

  if (!meal) return null;

  return { ...meal, is_favorite: Boolean(meal.is_favorite) };
}

export async function saveMeal(meal) {
  meal.slug = await generateUniqueSlug(meal.title, "meals");
  meal.instructions = xss(meal.instructions);

  const match = meal.image.match(/^data:(.+);base64,(.*)$/);
  if (!match) {
    throw new Error("Invalid image format");
  }

  const mimeType = match[1];
  const base64Data = match[2];
  const extension = mimeType.split("/")[1];

  const fileName = `${meal.slug}.${extension}`;

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

  meal.image = fileName;

  db.prepare(
    `
      INSERT INTO meals
        (title, calories, protein, instructions, image, slug, user_id)
      VALUES (
        @title,
        @calories,
        @protein,
        @instructions,
        @image,
        @slug,
        @user_id
      )
    `
  ).run(meal);
}

export async function getMealsByUser(userId) {
  return db
    .prepare(
      `
      SELECT
        meals.*,
        users.username,
        CASE
          WHEN meal_favorites.id IS NOT NULL THEN 1
          ELSE 0
        END AS is_favorite
      FROM meals
      JOIN users ON meals.user_id = users.id
      LEFT JOIN meal_favorites
        ON meals.id = meal_favorites.meal_id
        AND meal_favorites.user_id = ?
      WHERE meals.user_id = ?
    `
    )
    .all(userId, userId)
    .map((meal) => ({
      ...meal,
      is_favorite: Boolean(meal.is_favorite),
    }));
}

export async function getFavoriteMealsByUser(userId) {
  return db
    .prepare(
      `
      SELECT
        meals.*,
        users.username,
        1 AS is_favorite
      FROM meal_favorites
      JOIN meals ON meal_favorites.meal_id = meals.id
      JOIN users ON meals.user_id = users.id
      WHERE meal_favorites.user_id = ?
    `
    )
    .all(userId)
    .map((meal) => ({
      ...meal,
      is_favorite: Boolean(meal.is_favorite),
    }));
}

export async function addMealToFavoritesByUser(mealId, userId) {
  return db
    .prepare(
      `
      INSERT OR IGNORE INTO meal_favorites (meal_id, user_id)
      VALUES (?, ?)
    `
    )
    .run(mealId, userId);
}

export async function removeMealFromFavoritesByUser(mealId, userId) {
  return db
    .prepare(
      `
      DELETE FROM meal_favorites
      WHERE meal_id = ? AND user_id = ?
    `
    )
    .run(mealId, userId);
}

export async function deleteMealByUser(mealId, userId) {
  const meal = db
    .prepare(
      `
      SELECT image
      FROM meals
      WHERE id = ? AND user_id = ?
    `
    )
    .get(mealId, userId);

  if (!meal) {
    return;
  }

  if (meal.image) {
    try {
      await s3.deleteObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: meal.image,
      });
    } catch (error) {
      console.error("Deleting image from S3 failed:", error);
    }
  }

  return db
    .prepare(
      `
      DELETE FROM meals
      WHERE id = ? AND user_id = ?
    `
    )
    .run(mealId, userId);
}

export async function updateMealByUserId(id, userId, updatedData) {
  const currentMeal = db
    .prepare("SELECT * FROM meals WHERE id = ? AND user_id = ?")
    .get(id, userId);

  if (!currentMeal) return null;

  let slug = currentMeal.slug;
  if (updatedData.title && updatedData.title !== currentMeal.title) {
    slug = await generateUniqueSlug(updatedData.title, "meals");
  }

  let instructions = currentMeal.instructions;
  if (updatedData.instructions) {
    instructions = xss(updatedData.instructions);
  }

  let imageKey = currentMeal.image;

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

      if (currentMeal.image) {
        try {
          await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: currentMeal.image,
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
      UPDATE meals
      SET
        title = @title,
        calories = @calories,
        protein = @protein,
        instructions = @instructions,
        image = @image,
        slug = @slug
      WHERE id = @id AND user_id = @userId
    `
  ).run({
    id,
    userId,
    title: updatedData.title || currentMeal.title,
    calories: updatedData.calories ?? currentMeal.calories,
    protein: updatedData.protein ?? currentMeal.protein,
    instructions,
    image: imageKey,
    slug,
  });

  const updatedMeal = db
    .prepare("SELECT * FROM meals WHERE id = ? AND user_id = ?")
    .get(id, userId);

  return updatedMeal;
}
