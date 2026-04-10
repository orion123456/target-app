import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './db/pool.js';

const start = async (): Promise<void> => {
  try {
    await pool.query('SELECT 1');

    app.listen(env.PORT, () => {
      console.log(`Backend started on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start backend', error);
    process.exit(1);
  }
};

void start();
