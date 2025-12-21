import * as SQLite from "expo-sqlite";

let dbPromise: Promise<any> | null = null;

async function openDb() {
  // expo-sqlite versi baru: openDatabaseAsync
  if (typeof (SQLite as any).openDatabaseAsync === "function") {
    return (SQLite as any).openDatabaseAsync("resepbunda.db");
  }

  // fallback lama: openDatabase
  if (typeof (SQLite as any).openDatabase === "function") {
    return (SQLite as any).openDatabase("resepbunda.db");
  }

  throw new Error("SQLite API not available (no openDatabase/openDatabaseAsync).");
}

export async function getDb() {
  if (!dbPromise) dbPromise = openDb();
  return dbPromise;
}

export async function querySql<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getDb();

  // API baru
  if (typeof db.getAllAsync === "function") {
    return (await db.getAllAsync(sql, params)) as T[];
  }

  // API lama
  return await new Promise<T[]>((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        sql,
        params,
        (_: any, res: any) => resolve(res.rows._array as T[]),
        (_: any, err: any) => {
          reject(err);
          return false;
        }
      );
    });
  });
}

export async function execSql(sql: string, params: any[] = []): Promise<void> {
  const db = await getDb();

  // API baru
  if (typeof db.runAsync === "function") {
    await db.runAsync(sql, params);
    return;
  }

  // API lama
  await new Promise<void>((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        sql,
        params,
        () => resolve(),
        (_: any, err: any) => {
          reject(err);
          return false;
        }
      );
    });
  });
}
