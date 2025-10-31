"use server";

import fs from "node:fs";
import xss from "xss";

import db from "../db";
import { generateUniqueSlug } from "../server-utils";

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

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving image failed!");
    }
  });

  meal.image = `/images/${fileName}`;

  db.prepare(
    `
      INSERT INTO meals
        (title, calories, protein, instructions, image, slug, user_id )
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
