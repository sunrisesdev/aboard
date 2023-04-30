import clsx from 'clsx';
import styles from './FilterButton.module.scss';
import { FilterButtonProps } from './types';

const FilterButton = ({
  children,
  className,
  isActive,
  onClick,
  value,
}: FilterButtonProps) => {
  return (
    <button
      className={clsx(styles.base, isActive && styles.isActive, className)}
      onClick={() => onClick(value)}
    >
      {children}
    </button>
  );
};

export default FilterButton;
