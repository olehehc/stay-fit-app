"use server";

import slugify from "slugify";

import db from "./db.js";

export async function generateUniqueSlug(title, table) {
  const baseSlug = slugify(title, { lower: true, strict: true });

  const rows = db
    .prepare(`SELECT slug FROM ${table} WHERE slug LIKE ?`)
    .all(`${baseSlug}%`);

  const existingSlugs = rows.map((row) => row.slug);

  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++;
  }

  return `${baseSlug}-${counter}`;
}
