import clsx from 'clsx';
import styles from './Button.module.scss';
import { ButtonProps } from './types';

const Button = ({ children, disabled, onClick, variant }: ButtonProps) => {
  return (
    <button
      className={clsx(styles.base, variant && styles[variant])}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
