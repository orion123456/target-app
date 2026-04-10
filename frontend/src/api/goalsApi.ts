export interface GoalApiItem {
  id: string;
  year: number;
  month: number;
  title: string;
  plan: number | null;
  daysData: Record<string, string>;
  fact: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrUpdateGoalPayload {
  year: number;
  month: number;
  title: string;
  plan: number | null;
  daysData: Record<string, string>;
}

interface ApiSuccess<T> {
  data: T;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const payload = (await response.json()) as ApiSuccess<T> | { error?: string };

  if (!response.ok) {
    const message = 'error' in payload && payload.error ? payload.error : 'Request failed';
    throw new Error(message);
  }

  return (payload as ApiSuccess<T>).data;
};

export const fetchGoals = (year: number, month: number): Promise<GoalApiItem[]> => {
  return request<GoalApiItem[]>(`/goals?year=${year}&month=${month}`);
};

export const createGoal = (payload: CreateOrUpdateGoalPayload): Promise<GoalApiItem> => {
  return request<GoalApiItem>('/goals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};

export const updateGoal = (id: string, payload: CreateOrUpdateGoalPayload): Promise<GoalApiItem> => {
  return request<GoalApiItem>(`/goals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};

export const deleteGoal = (id: string): Promise<{ message: string }> => {
  return request<{ message: string }>(`/goals/${id}`, {
    method: 'DELETE'
  });
};
