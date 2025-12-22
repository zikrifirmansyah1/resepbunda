// src/services/db/index.ts (atau nama file db anda)
import { execBatch, execSql, querySql } from "./client";
import { schema } from "./schema";
import { recipes as recipeSeeds } from "./seeds/recipes";

// Helper untuk mengecek apakah kolom ada di tabel
async function columnExists(table: string, column: string) {
  try {
    const cols = await querySql<{ name: string }>(`PRAGMA table_info(${table});`);
    return cols.some((c) => c.name === column);
  } catch (e) {
    console.log(`Error checking column ${column} in ${table}`, e);
    return false;
  }
}

async function ensureUsersColumns() {
  // Pastikan tabel dasar users ada
  await execSql(schema.users);

  // MIGRATION: Cek dan tambah kolom fullName jika belum ada
  if (!(await columnExists("users", "fullName"))) {
    console.log("Migrating: Adding fullName to users");
    await execSql(`ALTER TABLE users ADD COLUMN fullName TEXT;`);
  }
  
  // MIGRATION: Cek kolom lain
  if (!(await columnExists("users", "bio"))) {
    await execSql(`ALTER TABLE users ADD COLUMN bio TEXT;`);
  }
  if (!(await columnExists("users", "avatarUrl"))) {
    await execSql(`ALTER TABLE users ADD COLUMN avatarUrl TEXT;`);
  }
  if (!(await columnExists("users", "badgePrimary"))) {
    await execSql(`ALTER TABLE users ADD COLUMN badgePrimary TEXT;`);
  }
  if (!(await columnExists("users", "badgeSecondary"))) {
    await execSql(`ALTER TABLE users ADD COLUMN badgeSecondary TEXT;`);
  }
}

async function ensureRecipesColumns() {
  await execSql(schema.recipes);
  if (!(await columnExists("recipes", "creator_email"))) {
    await execSql(`ALTER TABLE recipes ADD COLUMN creator_email TEXT;`);
  }
}

async function seedRecipes() {
  await execSql(schema.recipes);
  const r = await querySql<{ cnt: number }>("SELECT COUNT(*) as cnt FROM recipes;");
  if ((r[0]?.cnt ?? 0) > 0) return;

  const insertQuery = `
    INSERT INTO recipes (
      title, description, creator, creatorType, creator_email, 
      cookingTime, category, isPrivate, rating, calories, ingredients, steps
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const rows = recipeSeeds.slice(0, 5).map((recipe) => [
    recipe.title,
    recipe.description,
    recipe.creator,
    recipe.creatorType,
    null,
    recipe.cookingTime,
    recipe.category,
    recipe.isPrivate ? 1 : 0,
    recipe.rating ?? null,
    recipe.calories ?? null,
    JSON.stringify(recipe.ingredients ?? []),
    JSON.stringify(recipe.steps ?? []),
  ]);

  await execBatch(insertQuery, rows);
}

export async function initDb() {
  console.log("Initializing Database...");
  // Buat tabel basic
  await execSql(schema.users);
  await execSql(schema.session);
  await execSql(schema.saved_recipes);
  
  // Jalankan Migrasi (PENTING: ini harus ditunggu/await)
  await ensureUsersColumns();
  await ensureRecipesColumns();

  // Init session jika perlu
  const s = await querySql<{ cnt: number }>("SELECT COUNT(*) as cnt FROM session WHERE id = 1;");
  if ((s[0]?.cnt ?? 0) === 0) {
    await execSql("INSERT INTO session (id, is_logged_in, email, logged_in_at) VALUES (1,0,'','');");
  }

  await seedRecipes();
  console.log("Database Ready.");
}

export { execBatch, execSql, querySql };
