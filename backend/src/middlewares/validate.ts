import type { NextFunction, Request, Response } from 'express';
import type { ZodError, ZodTypeAny } from 'zod';

const formatZodError = (error: ZodError): string => {
  return error.issues.map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`).join('; ');
};

export const validateBody = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: formatZodError(parsed.error) });
      return;
    }

    req.validatedBody = parsed.data;
    next();
  };
};

export const validateQuery = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({ error: formatZodError(parsed.error) });
      return;
    }

    req.validatedQuery = parsed.data;
    next();
  };
};

export const validateParams = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.params);

    if (!parsed.success) {
      res.status(400).json({ error: formatZodError(parsed.error) });
      return;
    }

    req.validatedParams = parsed.data;
    next();
  };
};
