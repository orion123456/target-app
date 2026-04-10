import type { NextFunction, Request, Response } from 'express';
import { GoalsService } from '../services/goalsService.js';
import type { CreateGoalDto, PatchGoalDto, UpdateGoalDto } from '../types/goals.js';
import { success } from '../utils/http.js';

export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  getGoals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { year, month } = req.validatedQuery as { year: number; month: number };
      const goals = await this.goalsService.getByMonth(year, month);
      res.status(200).json(success(goals));
    } catch (error) {
      next(error);
    }
  };

  createGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = req.validatedBody as CreateGoalDto;
      const created = await this.goalsService.create(payload);
      res.status(201).json(success(created));
    } catch (error) {
      next(error);
    }
  };

  replaceGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams as { id: string };
      const payload = req.validatedBody as UpdateGoalDto;
      const updated = await this.goalsService.replace(id, payload);
      res.status(200).json(success(updated));
    } catch (error) {
      next(error);
    }
  };

  patchGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams as { id: string };
      const payload = req.validatedBody as PatchGoalDto;
      const updated = await this.goalsService.patch(id, payload);
      res.status(200).json(success(updated));
    } catch (error) {
      next(error);
    }
  };

  deleteGoal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.validatedParams as { id: string };
      await this.goalsService.delete(id);
      res.status(200).json(success({ message: 'Goal deleted successfully' }));
    } catch (error) {
      next(error);
    }
  };
}
