import { GoalsRepository } from '../repositories/goalsRepository.js';
import type { CreateGoalDto, GoalResponse, PatchGoalDto, UpdateGoalDto } from '../types/goals.js';
import { calculateFact } from '../utils/calculateFact.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { getDaysInMonth } from '../utils/date.js';

export class GoalsService {
  constructor(private readonly goalsRepository: GoalsRepository) {}

  async getByMonth(year: number, month: number): Promise<GoalResponse[]> {
    const goals = await this.goalsRepository.findByMonth(year, month);
    return goals.map((goal) => ({ ...goal, fact: calculateFact(goal.daysData) }));
  }

  async create(payload: CreateGoalDto): Promise<GoalResponse> {
    this.validateDays(payload.year, payload.month, payload.daysData);
    const created = await this.goalsRepository.create(payload);

    return {
      ...created,
      fact: calculateFact(created.daysData)
    };
  }

  async replace(id: string, payload: UpdateGoalDto): Promise<GoalResponse> {
    this.validateDays(payload.year, payload.month, payload.daysData);
    const updated = await this.goalsRepository.replace(id, payload);

    if (!updated) {
      throw new NotFoundError(`Goal with id ${id} not found`);
    }

    return {
      ...updated,
      fact: calculateFact(updated.daysData)
    };
  }

  async patch(id: string, payload: PatchGoalDto): Promise<GoalResponse> {
    if (payload.daysData && payload.year && payload.month) {
      this.validateDays(payload.year, payload.month, payload.daysData);
    }

    const existing = await this.goalsRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Goal with id ${id} not found`);
    }

    const mergedYear = payload.year ?? existing.year;
    const mergedMonth = payload.month ?? existing.month;
    const mergedDaysData = payload.daysData ?? existing.daysData;

    this.validateDays(mergedYear, mergedMonth, mergedDaysData);

    const updated = await this.goalsRepository.patch(id, payload);

    if (!updated) {
      throw new NotFoundError(`Goal with id ${id} not found`);
    }

    return {
      ...updated,
      fact: calculateFact(updated.daysData)
    };
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.goalsRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError(`Goal with id ${id} not found`);
    }
  }

  private validateDays(year: number, month: number, daysData: Record<string, string>): void {
    const maxDay = getDaysInMonth(year, month);

    for (const key of Object.keys(daysData)) {
      const day = Number(key);

      if (!Number.isInteger(day) || day < 1 || day > maxDay) {
        throw new ValidationError(`daysData key "${key}" is out of range for ${year}-${month}`);
      }
    }
  }
}
