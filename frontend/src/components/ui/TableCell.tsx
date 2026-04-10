import type { PropsWithChildren, TdHTMLAttributes } from 'react';
import styles from './TableCell.module.css';

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  subtle?: boolean;
}

export const TableCell = ({ subtle = false, className = '', children, ...props }: PropsWithChildren<TableCellProps>): JSX.Element => {
  const subtleClass = subtle ? styles.subtle : '';
  return (
    <td className={`${styles.cell} ${subtleClass} ${className}`.trim()} {...props}>
      {children}
    </td>
  );
};
