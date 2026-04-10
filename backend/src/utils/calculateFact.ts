import type { DaysData } from '../types/goals.js';

const NUMBER_PATTERN = /^[-+]?\d+(?:\.\d+)?$/;

export const getCellContribution = (value: unknown): number => {
  if (value === null || value === undefined) {
    return 0;
  }

  const normalized = String(value).trim();

  if (normalized === '') {
    return 0;
  }

  if (NUMBER_PATTERN.test(normalized)) {
    return Number(normalized);
  }

  return 1;
};

export const calculateFact = (daysData: DaysData): number => {
  return Object.values(daysData).reduce((sum, value) => sum + getCellContribution(value), 0);
};
