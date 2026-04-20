import { useEffect, useRef } from 'react';
import { GoalRow } from './GoalRow';
import type { GoalRowData } from '../types/goals';
import { Button } from './ui/Button';
import styles from './GoalsTable.module.css';

interface GoalsTableProps {
  rows: GoalRowData[];
  daysInMonth: number;
  todayDayIndex: number | null;
  onAddRow: () => void;
  onUpdateRow: (id: string, nextRow: GoalRowData) => void;
  onDeleteRow: (id: string) => void;
}

export const GoalsTable = ({
  rows,
  daysInMonth,
  todayDayIndex,
  onAddRow,
  onUpdateRow,
  onDeleteRow
}: GoalsTableProps): JSX.Element => {
  const dayHeaders = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const SCROLL_RIGHT_BIAS_PX = 20;

  useEffect(() => {
    if (todayDayIndex === null || !scrollRef.current) {
      return;
    }

    const container = scrollRef.current;
    const dayHeader = container.querySelector<HTMLElement>(`[data-day-index="${todayDayIndex}"]`);

    if (!dayHeader) {
      return;
    }

    const stickyColumn = container.querySelector<HTMLElement>('.sticky-col');
    const stickyWidth = stickyColumn?.getBoundingClientRect().width ?? 0;
    const visibleAreaWidth = Math.max(0, container.clientWidth - stickyWidth);
    const visibleCenterX = stickyWidth + visibleAreaWidth / 2 + SCROLL_RIGHT_BIAS_PX;
    const target = dayHeader.offsetLeft - visibleCenterX + dayHeader.clientWidth / 2;
    container.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [todayDayIndex, daysInMonth]);

  return (
    <section className={`${styles.wrapper} print-table-wrap`}>
      <p className={`${styles.mobileHint} print-hide`} aria-hidden="true">
        Листайте таблицу по горизонтали, чтобы видеть все дни месяца.
      </p>
      <div ref={scrollRef} className={`${styles.tableScroll} print-table-scroll`}>
        <table className={`${styles.table} print-table`}>
          <thead>
            <tr className={styles.headRow}>
              <th className={`${styles.headCell} ${styles.stickyCol} sticky-col`}>Цель</th>
              {dayHeaders.map((day) => (
                <th
                  key={`day-header-${day}`}
                  data-day-index={day - 1}
                  className={`${styles.headCell} ${styles.headCenter} ${styles.dayHead} day-col ${
                    todayDayIndex === day - 1 ? styles.todayColumn : ''
                  } ${todayDayIndex === day - 1 ? 'today-col' : ''}`}
                >
                  {day}
                </th>
              ))}
              <th className={`${styles.headCell} ${styles.headCenter}`}>План</th>
              <th className={`${styles.headCell} ${styles.headCenter}`}>Факт</th>
              <th className={`${styles.headCell} ${styles.headCenter}`}>Удалить</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={daysInMonth + 4} className={styles.emptyState}>
                  Целей пока нет. Добавьте первую строку.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <GoalRow
                  key={row.id}
                  row={row}
                  daysInMonth={daysInMonth}
                  todayDayIndex={todayDayIndex}
                  onChange={(nextRow) => onUpdateRow(row.id, nextRow)}
                  onDelete={() => onDeleteRow(row.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={`${styles.footer} print-hide`}>
        <Button type="button" variant="text" className={styles.addButton} onClick={onAddRow}>
          + Добавить строку
        </Button>
      </div>
    </section>
  );
};
