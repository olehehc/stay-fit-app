import fs from "node:fs";
import xss from "xss";

import db from "../db";
import { generateUniqueSlug } from "../server-utils";

export function getMeals() {
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = await generateUniqueSlug(meal.title);
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
        (creator, creator_email, title, calories, protein, instructions, image, slug)
      VALUES (
        @creator,
        @creator_email,
        @title,
        @calories,
        @protein,
        @instructions,
        @image,
        @slug
      )
    `
  ).run(meal);
}
