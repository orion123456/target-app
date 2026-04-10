import { Router } from 'express';
import { goalsRouter } from './goalsRoutes.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.status(200).json({ data: { status: 'ok' } });
});

apiRouter.use('/goals', goalsRouter);
