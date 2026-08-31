import { PoolClient } from "pg";
import { db } from "../src/configs/db.config";
import path from "node:path";
import fs from "node:fs";
import { performance } from "node:perf_hooks";

async function migrate(): Promise<void> {
  const startTime = performance.now();
  let client: PoolClient | undefined;

  console.log("\n========== DATABASE MIGRATION ==========");
  console.log(`[INFO] Migration started at ${new Date().toLocaleString()}`);

  try {
    client = await db.connect();

    console.log("[INFO] Database connection established");

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("[INFO] Migration table is ready");

    const migrationDir = path.join(
      process.cwd(),
      "databases",
      "migrations",
    );

    if (!fs.existsSync(migrationDir)) {
      console.log(`[INFO] Migration directory not found: ${migrationDir}`);
      return;
    }

    const files = fs
      .readdirSync(migrationDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("[INFO] No migration files found");
      return;
    }

    console.log(`[INFO] Found ${files.length} migration file(s)`);

    let executed = 0;
    let skipped = 0;

    for (const file of files) {
      const result = await client.query(
        `
          SELECT id
          FROM migrations
          WHERE name = $1
        `,
        [file],
      );

      if (result.rows.length > 0) {
        console.log(`[SKIP] ${file} - already executed`);
        skipped++;
        continue;
      }

      const migrationStart = performance.now();

      console.log(`[RUN]  ${file}`);

      const sql = fs.readFileSync(
        path.join(migrationDir, file),
        "utf-8",
      );

      try {
        await client.query("BEGIN");

        await client.query(sql);

        await client.query(
          `
            INSERT INTO migrations (name)
            VALUES ($1)
          `,
          [file],
        );

        await client.query("COMMIT");

        const duration = performance.now() - migrationStart;

        console.log(
          `[DONE] ${file} - ${duration.toFixed(2)} ms`,
        );

        executed++;
      } catch (error) {
        await client.query("ROLLBACK");

        const duration = performance.now() - migrationStart;

        console.error(
          `[FAILED] ${file} - ${duration.toFixed(2)} ms`,
        );

        throw error;
      }
    }

    const totalDuration = performance.now() - startTime;

    console.log("\n========== MIGRATION SUMMARY ==========");
    console.log(`[INFO] Executed : ${executed}`);
    console.log(`[INFO] Skipped  : ${skipped}`);
    console.log(`[INFO] Total    : ${files.length}`);
    console.log(`[INFO] Duration : ${totalDuration.toFixed(2)} ms`);
    console.log("=======================================\n");
  } catch (error) {
    const duration = performance.now() - startTime;

    console.error("\n========== MIGRATION FAILED ==========");
    console.error(`[ERROR] Duration : ${duration.toFixed(2)} ms`);
    console.error("[ERROR] Migration process failed");
    console.error(error);
    console.error("======================================\n");

    throw error;
  } finally {
    client?.release();
    console.log("[INFO] Database client released");
  }
}

migrate()
  .then(async () => {
    await db.end();

    console.log("[INFO] Database pool closed");
    console.log("[SUCCESS] Migration completed successfully\n");

    process.exit(0);
  })
  .catch(async () => {
    await db.end();

    console.log("[INFO] Database pool closed");
    console.log("[ERROR] Migration process terminated\n");

    process.exit(1);
  });