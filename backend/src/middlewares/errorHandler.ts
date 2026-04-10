import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors.js';

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Route not found' });
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  console.error('Unhandled error', error);
  res.status(500).json({ error: 'Internal server error' });
};
