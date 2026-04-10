export type MonthKey = string;

export interface GoalRowData {
  id: string;
  goal: string;
  days: string[];
  plan: string;
}

export type GoalsByMonth = Record<MonthKey, GoalRowData[]>;
