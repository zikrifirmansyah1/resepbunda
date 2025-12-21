export const schema = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `,
  session: `
    CREATE TABLE IF NOT EXISTS session (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      is_logged_in INTEGER NOT NULL,
      email TEXT NOT NULL,
      logged_in_at TEXT NOT NULL
    );
  `,
};
