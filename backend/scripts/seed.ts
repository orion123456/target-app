import { pool } from '../src/db/pool.js';

const seed = async (): Promise<void> => {
  await pool.query(
    `
      INSERT INTO goals (year, month, title, plan, days_data)
      VALUES
      (2026, 3, 'Прочитать книги', 20, '{"1":"", "2":"done", "3":"5", "4":"2 раза"}'::jsonb),
      (2026, 3, 'Тренировки', 12, '{"1":"1", "2":"1", "3":"", "4":"тренировка"}'::jsonb)
    `
  );

  console.log('Seed completed successfully');
};

seed()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
