import { Router } from 'express';
import { GoalsController } from '../controllers/goalsController.js';
import { GoalsRepository } from '../repositories/goalsRepository.js';
import { GoalsService } from '../services/goalsService.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validate.js';
import {
  createGoalSchema,
  getGoalsQuerySchema,
  idParamSchema,
  patchGoalSchema,
  putGoalSchema
} from '../validators/goalsSchemas.js';

const goalsRepository = new GoalsRepository();
const goalsService = new GoalsService(goalsRepository);
const goalsController = new GoalsController(goalsService);

export const goalsRouter = Router();

goalsRouter.get('/', validateQuery(getGoalsQuerySchema), goalsController.getGoals);
goalsRouter.post('/', validateBody(createGoalSchema), goalsController.createGoal);
goalsRouter.put('/:id', validateParams(idParamSchema), validateBody(putGoalSchema), goalsController.replaceGoal);
goalsRouter.patch('/:id', validateParams(idParamSchema), validateBody(patchGoalSchema), goalsController.patchGoal);
goalsRouter.delete('/:id', validateParams(idParamSchema), goalsController.deleteGoal);
