import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'ghost' | 'icon' | 'text';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = ({ variant = 'ghost', className = '', ...props }: ButtonProps): JSX.Element => {
  const variantClass =
    variant === 'icon' ? styles.icon : variant === 'text' ? styles.text : styles.ghost;

  return <button className={`${styles.button} ${variantClass} ${className}`.trim()} {...props} />;
};
