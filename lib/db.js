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
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `
).run();

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      exercise_type TEXT NOT NULL,
      muscle_group TEXT NOT NULL,
      image TEXT,
      instructions TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `
).run();

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS trainings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      training_date TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `
).run();

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS training_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      training_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      set_order_index INTEGER NOT NULL,
      exercise_order_index INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight INTEGER NOT NULL,
      rest INTEGER NOT NULL,
      FOREIGN KEY (training_id) REFERENCES trainings(id),
      FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    )
  `
).run();

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS performed_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      training_set_id INTEGER NOT NULL,
      actual_reps INTEGER NOT NULL,
      actual_weight INTEGER NOT NULL,
      actual_rest INTEGER NOT NULL,
      performed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (training_set_id) REFERENCES training_sets(id)
    )
  `
).run();

export default db;
