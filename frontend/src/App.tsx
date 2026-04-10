import { useEffect, useMemo, useRef, useState } from 'react';
import { MonthNavigator } from './components/MonthNavigator';
import { GoalsTable } from './components/GoalsTable';
import type { GoalRowData } from './types/goals';
import { getDaysInMonth } from './utils/date';
import { createGoal, deleteGoal, fetchGoals, type GoalApiItem, updateGoal } from './api/goalsApi';
import styles from './App.module.css';

const AUTOSAVE_DELAY_MS = 500;

const getInitialMonth = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const toDaysData = (days: string[]): Record<string, string> => {
  return days.reduce<Record<string, string>>((accumulator, value, index) => {
    accumulator[String(index + 1)] = value;
    return accumulator;
  }, {});
};

const toGoalRow = (goal: GoalApiItem, daysInMonth: number): GoalRowData => {
  const days = Array.from({ length: daysInMonth }, (_, index) => goal.daysData[String(index + 1)] ?? '');

  return {
    id: goal.id,
    goal: goal.title,
    days,
    plan: goal.plan === null ? '' : String(goal.plan)
  };
};

const parsePlan = (value: string): number | null => {
  const normalized = value.trim();

  if (normalized === '') {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};

const App = (): JSX.Element => {
  const [currentMonth, setCurrentMonth] = useState<Date>(getInitialMonth);
  const [rows, setRows] = useState<GoalRowData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const saveTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;
  const daysInMonth = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);
  const today = new Date();
  const isCurrentDisplayedMonth = year === today.getFullYear() && month === today.getMonth() + 1;
  const todayDayIndex = isCurrentDisplayedMonth ? Math.min(today.getDate(), daysInMonth) - 1 : null;

  useEffect(() => {
    let isCancelled = false;

    const loadGoals = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const goals = await fetchGoals(year, month);

        if (!isCancelled) {
          setRows(goals.map((goal) => toGoalRow(goal, daysInMonth)));
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить цели');
          setRows([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadGoals();

    return () => {
      isCancelled = true;
    };
  }, [year, month, daysInMonth]);

  useEffect(() => {
    return () => {
      Object.values(saveTimersRef.current).forEach((timerId) => clearTimeout(timerId));
      saveTimersRef.current = {};
    };
  }, []);

  const changeMonth = (offset: number): void => {
    setCurrentMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + offset, 1));
  };

  const scheduleRowSave = (row: GoalRowData, rowYear: number, rowMonth: number): void => {
    const timerKey = `${row.id}:${rowYear}:${rowMonth}`;

    if (saveTimersRef.current[timerKey]) {
      clearTimeout(saveTimersRef.current[timerKey]);
    }

    saveTimersRef.current[timerKey] = setTimeout(() => {
      void updateGoal(row.id, {
        year: rowYear,
        month: rowMonth,
        title: row.goal,
        plan: parsePlan(row.plan),
        daysData: toDaysData(row.days)
      }).catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : 'Не удалось сохранить изменения');
      });
    }, AUTOSAVE_DELAY_MS);
  };

  const addRow = async (): Promise<void> => {
    try {
      setErrorMessage(null);

      const created = await createGoal({
        year,
        month,
        title: '',
        plan: null,
        daysData: toDaysData(Array.from({ length: daysInMonth }, () => ''))
      });

      setRows((previous) => [...previous, toGoalRow(created, daysInMonth)]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось создать строку');
    }
  };

  const updateRow = (id: string, nextRow: GoalRowData): void => {
    setRows((previous) => previous.map((row) => (row.id === id ? nextRow : row)));
    scheduleRowSave(nextRow, year, month);
  };

  const removeRow = async (id: string): Promise<void> => {
    try {
      setErrorMessage(null);
      await deleteGoal(id);
      setRows((previous) => previous.filter((row) => row.id !== id));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось удалить строку');
    }
  };

  return (
    <main className={`${styles.shell} print-root`}>
      <div className={styles.container}>
        <MonthNavigator
          currentMonth={currentMonth}
          onPrevious={() => changeMonth(-1)}
          onNext={() => changeMonth(1)}
          onPrint={() => window.print()}
        />

        {errorMessage ? <div className={`${styles.notice} ${styles.noticeError} print-hide`}>{errorMessage}</div> : null}
        {isLoading ? <div className={`${styles.notice} ${styles.noticeInfo} print-hide`}>Загрузка целей...</div> : null}

        <GoalsTable
          rows={rows}
          daysInMonth={daysInMonth}
          todayDayIndex={todayDayIndex}
          onAddRow={() => {
            void addRow();
          }}
          onUpdateRow={updateRow}
          onDeleteRow={(id) => {
            void removeRow(id);
          }}
        />
      </div>
    </main>
  );
};

export default App;
