import clsx from 'clsx';
import { MdClose } from 'react-icons/md';
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
      {isActive && <MdClose size={16} />}
    </button>
  );
};

export default FilterButton;
