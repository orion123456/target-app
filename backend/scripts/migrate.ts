import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/db/pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async (): Promise<void> => {
  const migrationsDir = path.resolve(__dirname, '../migrations');
  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();

  if (files.length === 0) {
    console.log('No migrations found');
    return;
  }

  for (const file of files) {
    const sql = await readFile(path.join(migrationsDir, file), 'utf8');
    console.log(`Running migration: ${file}`);
    await pool.query(sql);
  }

  console.log('Migrations completed successfully');
};

run()
  .catch((error) => {
    console.error('Migration failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
