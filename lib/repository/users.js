import db from "../db";

export function createUser({ username, email, password }) {
  const stmt = db.prepare(`
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
  `);
  const result = stmt.run(username, email, password);
  return result.lastInsertRowid;
}

export function getUserByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}
