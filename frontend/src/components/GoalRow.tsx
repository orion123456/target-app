import { calculateFact, getPlanState } from '../utils/fact';
import type { GoalRowData } from '../types/goals';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { TableCell } from './ui/TableCell';
import styles from './GoalRow.module.css';

interface GoalRowProps {
  row: GoalRowData;
  daysInMonth: number;
  todayDayIndex: number | null;
  onChange: (nextRow: GoalRowData) => void;
  onDelete: () => void;
}

const normalizeDays = (days: string[], daysInMonth: number): string[] => {
  if (days.length === daysInMonth) {
    return days;
  }

  if (days.length > daysInMonth) {
    return days.slice(0, daysInMonth);
  }

  return [...days, ...Array.from({ length: daysInMonth - days.length }, () => '')];
};

export const GoalRow = ({ row, daysInMonth, todayDayIndex, onChange, onDelete }: GoalRowProps): JSX.Element => {
  const days = normalizeDays(row.days, daysInMonth);
  const fact = calculateFact(days);
  const planState = getPlanState(row.plan, fact);

  const onDayChange = (dayIndex: number, value: string): void => {
    const nextDays = [...days];
    nextDays[dayIndex] = value;
    onChange({ ...row, days: nextDays });
  };

  const planCellClass =
    planState === 'success' ? styles.planSuccess : planState === 'danger' ? styles.planDanger : styles.planNeutral;

  return (
    <tr className={styles.row}>
      <TableCell className={`${styles.cell} ${styles.stickyCol} sticky-col`}>
        <Input
          type="text"
          value={row.goal}
          onChange={(event) => onChange({ ...row, goal: event.target.value })}
          placeholder="Введите цель"
        />
      </TableCell>

      {days.map((dayValue, dayIndex) => (
        <TableCell
          key={`${row.id}-day-${dayIndex}`}
          className={`${styles.cell} ${styles.dayCell} day-col ${todayDayIndex === dayIndex ? styles.todayColumn : ''} ${
            todayDayIndex === dayIndex ? 'today-col' : ''
          }`}
        >
          <Input
            type="text"
            centered
            className={styles.numericInput}
            value={dayValue}
            onChange={(event) => onDayChange(dayIndex, event.target.value)}
            placeholder=""
          />
        </TableCell>
      ))}

      <TableCell className={`${styles.cell} ${planCellClass}`}>
        <Input
          type="text"
          centered
          className={styles.numericInput}
          value={row.plan}
          onChange={(event) => onChange({ ...row, plan: event.target.value })}
          placeholder="План"
        />
      </TableCell>

      <TableCell className={`${styles.cell} ${styles.fact}`}>{fact}</TableCell>

      <TableCell className={`${styles.cell} ${styles.deleteCell}`}>
        <Button type="button" variant="icon" className={styles.deleteButton} onClick={onDelete} aria-label="Удалить строку">
          ×
        </Button>
      </TableCell>
    </tr>
  );
};
