import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown;
      validatedQuery?: ParsedQs | Record<string, unknown>;
      validatedParams?: ParamsDictionary | Record<string, unknown>;
    }
  }
}

export {};
