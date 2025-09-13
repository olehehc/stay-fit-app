import fs from "node:fs";
import xss from "xss";

import db from "../db";
import { generateUniqueSlug } from "../server-utils";

export function getExercisesByCreator(creatorEmail) {
  return db
    .prepare("SELECT * FROM exercises WHERE creator_email = ?")
    .all(creatorEmail);
}

export async function saveExercise(exercise) {
  exercise.slug = await generateUniqueSlug(exercise.title);
  exercise.instructions = xss(exercise.instructions);

  if (exercise.image) {
    const extension = exercise.image.name.split(".").pop();
    const fileName = `${exercise.slug}.${extension}`;

    const stream = fs.createWriteStream(`public/images/${fileName}`);
    const bufferedImage = await exercise.image.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) => {
      if (error) {
        throw new Error("Saving image failed!");
      }
    });

    exercise.image = `/images/${fileName}`;
  } else {
    exercise.image = null;
  }

  db.prepare(
    `
      INSERT INTO exercises
        (creator, creator_email, title, exercise_type, muscle_group, instructions, image, slug)
      VALUES (
        @creator,
        @creator_email,
        @title,
        @exercise_type,
        @muscle_group,
        @instructions,
        @image,
        @slug
      )
    `
  ).run(exercise);
}
