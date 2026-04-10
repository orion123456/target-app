import { z } from 'zod';
import { getDaysInMonth } from '../utils/date.js';

const yearSchema = z.coerce.number().int().min(1970).max(3000);
const monthSchema = z.coerce.number().int().min(1).max(12);

const daysDataSchema = z
  .record(z.string())
  .superRefine((daysData, ctx) => {
    for (const [key, value] of Object.entries(daysData)) {
      if (!/^\d+$/.test(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `daysData key "${key}" must be a numeric day string`
        });
      }

      if (typeof value !== 'string') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `daysData value for key "${key}" must be a string`
        });
      }
    }
  });

const validateDaysRange = (year: number, month: number, daysData: Record<string, string>, ctx: z.RefinementCtx): void => {
  const daysInMonth = getDaysInMonth(year, month);

  for (const key of Object.keys(daysData)) {
    const day = Number(key);

    if (day < 1 || day > daysInMonth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `daysData key "${key}" is out of range for ${year}-${month}`
      });
    }
  }
};

export const getGoalsQuerySchema = z.object({
  year: yearSchema,
  month: monthSchema
});

export const createGoalSchema = z
  .object({
    year: yearSchema,
    month: monthSchema,
    title: z.string().default(''),
    plan: z.number().int().nullable().optional().default(null),
    daysData: daysDataSchema.default({})
  })
  .superRefine((data, ctx) => {
    validateDaysRange(data.year, data.month, data.daysData, ctx);
  });

export const putGoalSchema = z
  .object({
    year: yearSchema,
    month: monthSchema,
    title: z.string(),
    plan: z.number().int().nullable(),
    daysData: daysDataSchema
  })
  .superRefine((data, ctx) => {
    validateDaysRange(data.year, data.month, data.daysData, ctx);
  });

export const patchGoalSchema = z
  .object({
    year: yearSchema.optional(),
    month: monthSchema.optional(),
    title: z.string().optional(),
    plan: z.number().int().nullable().optional(),
    daysData: daysDataSchema.optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'PATCH body must contain at least one field'
  });

export const idParamSchema = z.object({
  id: z.string().uuid('id must be a valid UUID')
});
