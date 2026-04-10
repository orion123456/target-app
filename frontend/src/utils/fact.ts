const NUMBER_PATTERN = /^[-+]?\d+(?:\.\d+)?$/;

export const getCellContribution = (value: string): number => {
  const trimmed = value.trim();

  if (trimmed === '') {
    return 0;
  }

  if (NUMBER_PATTERN.test(trimmed)) {
    return Number(trimmed);
  }

  return 1;
};

export const calculateFact = (days: string[]): number => {
  return days.reduce((sum, day) => sum + getCellContribution(day), 0);
};

export const getPlanState = (plan: string, fact: number): 'neutral' | 'success' | 'danger' => {
  const trimmed = plan.trim();

  if (trimmed === '') {
    return 'neutral';
  }

  const target = Number(trimmed);

  if (Number.isNaN(target)) {
    return 'danger';
  }

  return fact >= target ? 'success' : 'danger';
};
