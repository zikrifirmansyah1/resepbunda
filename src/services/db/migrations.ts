import { execSql, querySql } from "./client";
import { schema } from "./schema";

const MOCK = {
  email: "bunda@example.com",
  password: "Bunda123!",
};

export async function initDb() {
  await execSql(schema.users);
  await execSql(schema.session);

  const u = await querySql<{ cnt: number }>(
    "SELECT COUNT(*) as cnt FROM users WHERE email = ?",
    [MOCK.email]
  );
  if ((u[0]?.cnt ?? 0) === 0) {
    await execSql(
      "INSERT INTO users (email, password, created_at) VALUES (?,?,?)",
      [MOCK.email, MOCK.password, new Date().toISOString()]
    );
  }

  const s = await querySql<{ cnt: number }>("SELECT COUNT(*) as cnt FROM session WHERE id = 1");
  if ((s[0]?.cnt ?? 0) === 0) {
    await execSql("INSERT INTO session (id, is_logged_in, email, logged_in_at) VALUES (1,0,'','')");
  }
}
