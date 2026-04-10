import { formatMonthLabel } from '../utils/date';
import { Button } from './ui/Button';
import styles from './MonthNavigator.module.css';

interface MonthNavigatorProps {
  currentMonth: Date;
  onPrevious: () => void;
  onNext: () => void;
  onPrint: () => void;
}

export const MonthNavigator = ({ currentMonth, onPrevious, onNext, onPrint }: MonthNavigatorProps): JSX.Element => {
  return (
    <header className={styles.header}>
      <p className={styles.sideTitle}>Цели месяца</p>
      <div className={styles.controls}>
        <Button type="button" variant="icon" onClick={onPrevious} aria-label="Предыдущий месяц">
          ←
        </Button>
        <h1 className={styles.title}>{formatMonthLabel(currentMonth)}</h1>
        <Button type="button" variant="icon" onClick={onNext} aria-label="Следующий месяц">
          →
        </Button>
      </div>
        <div className={`print-hide ${styles.printButton}`}>
            <Button type="button" variant="icon"  onClick={onPrint} aria-label="Печать">
                <svg className={styles.printIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        d="M7 8V4h10v4M7 16h10v4H7v-4ZM5 9h14a2 2 0 0 1 2 2v4h-4v-3H7v3H3v-4a2 2 0 0 1 2-2Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </Button>
        </div>

    </header>
  );
};
