import { query } from '../db/query.js';
import type { CreateGoalDto, GoalEntity, PatchGoalDto, UpdateGoalDto } from '../types/goals.js';
import { AppError } from '../utils/errors.js';

interface GoalRow {
  id: string;
  year: number;
  month: number;
  title: string;
  plan: number | null;
  days_data: Record<string, string>;
  created_at: Date;
  updated_at: Date;
}

const mapRowToEntity = (row: GoalRow): GoalEntity => ({
  id: row.id,
  year: row.year,
  month: row.month,
  title: row.title,
  plan: row.plan,
  daysData: row.days_data,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString()
});

export class GoalsRepository {
  async findByMonth(year: number, month: number): Promise<GoalEntity[]> {
    const result = await query<GoalRow>(
      `
        SELECT id, year, month, title, plan, days_data, created_at, updated_at
        FROM goals
        WHERE year = $1 AND month = $2
        ORDER BY created_at ASC
      `,
      [year, month]
    );

    return result.rows.map(mapRowToEntity);
  }

  async findById(id: string): Promise<GoalEntity | null> {
    const result = await query<GoalRow>(
      `
        SELECT id, year, month, title, plan, days_data, created_at, updated_at
        FROM goals
        WHERE id = $1
        LIMIT 1
      `,
      [id]
    );

    return result.rows[0] ? mapRowToEntity(result.rows[0]) : null;
  }

  async create(payload: CreateGoalDto): Promise<GoalEntity> {
    const result = await query<GoalRow>(
      `
        INSERT INTO goals (year, month, title, plan, days_data)
        VALUES ($1, $2, $3, $4, $5::jsonb)
        RETURNING id, year, month, title, plan, days_data, created_at, updated_at
      `,
      [payload.year, payload.month, payload.title, payload.plan, JSON.stringify(payload.daysData)]
    );

    const row = result.rows[0];

    if (!row) {
      throw new AppError('Failed to create goal');
    }

    return mapRowToEntity(row);
  }

  async replace(id: string, payload: UpdateGoalDto): Promise<GoalEntity | null> {
    const result = await query<GoalRow>(
      `
        UPDATE goals
        SET year = $2,
            month = $3,
            title = $4,
            plan = $5,
            days_data = $6::jsonb,
            updated_at = NOW()
        WHERE id = $1
        RETURNING id, year, month, title, plan, days_data, created_at, updated_at
      `,
      [id, payload.year, payload.month, payload.title, payload.plan, JSON.stringify(payload.daysData)]
    );

    return result.rows[0] ? mapRowToEntity(result.rows[0]) : null;
  }

  async patch(id: string, payload: PatchGoalDto): Promise<GoalEntity | null> {
    const current = await this.findById(id);

    if (!current) {
      return null;
    }

    const next: UpdateGoalDto = {
      year: payload.year ?? current.year,
      month: payload.month ?? current.month,
      title: payload.title ?? current.title,
      plan: payload.plan === undefined ? current.plan : payload.plan,
      daysData: payload.daysData ?? current.daysData
    };

    return this.replace(id, next);
  }

  async delete(id: string): Promise<boolean> {
    const result = await query<{ id: string }>(
      `
        DELETE FROM goals
        WHERE id = $1
        RETURNING id
      `,
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }
}
