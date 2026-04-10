import type { GoalRowData } from '../types/goals';

export const getMonthKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const formatMonthLabel = (date: Date): string => {
  const formatted = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric'
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const createEmptyGoalRow = (id: string, daysInMonth: number): GoalRowData => ({
  id,
  goal: '',
  days: Array.from({ length: daysInMonth }, () => ''),
  plan: ''
});
