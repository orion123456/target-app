export type DayKey = `${number}`;
export type DaysData = Record<DayKey, string>;

export interface GoalEntity {
  id: string;
  year: number;
  month: number;
  title: string;
  plan: number | null;
  daysData: DaysData;
  createdAt: string;
  updatedAt: string;
}

export interface GoalResponse extends GoalEntity {
  fact: number;
}

export interface CreateGoalDto {
  year: number;
  month: number;
  title: string;
  plan: number | null;
  daysData: DaysData;
}

export interface UpdateGoalDto {
  year: number;
  month: number;
  title: string;
  plan: number | null;
  daysData: DaysData;
}

export interface PatchGoalDto {
  year?: number;
  month?: number;
  title?: string;
  plan?: number | null;
  daysData?: DaysData;
}
