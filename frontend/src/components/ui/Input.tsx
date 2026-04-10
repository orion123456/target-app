import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  centered?: boolean;
}

export const Input = ({ centered = false, className = '', ...props }: InputProps): JSX.Element => {
  const centeredClass = centered ? styles.centered : '';
  return <input className={`${styles.input} ${centeredClass} ${className}`.trim()} {...props} />;
};
