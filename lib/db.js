import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "database.db");
const db = new Database(dbPath);

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
`
).run();

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      calories TEXT NOT NULL,
      protein TEXT NOT NULL,
      image TEXT NOT NULL,
      instructions TEXT NOT NULL,
      creator TEXT NOT NULL,
      creator_email TEXT NOT NULL
    )
  `
).run();

export default db;
