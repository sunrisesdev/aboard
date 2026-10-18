import { Input as BaseInput } from '@base-ui/react/input';
import { clsx } from 'clsx';
import styles from './Input.module.css';

export const Input = ({ className, ...props }: BaseInput.Props) => {
  return <BaseInput className={clsx(styles.base, className)} {...props} />;
};
