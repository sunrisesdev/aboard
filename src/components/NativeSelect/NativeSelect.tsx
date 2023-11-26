import { useId } from 'react';
import { TbChevronDown } from 'react-icons/tb';
import styles from './NativeSelect.module.scss';
import { NativeSelectProps } from './types';

export const NativeSelect = ({
  children,
  onSelect,
  options,
  value,
}: NativeSelectProps) => {
  const id = useId();

  return (
    <div className={styles.base}>
      <label htmlFor={id}>
        {children}

        <TbChevronDown className={styles.chevron} />
      </label>

      <select
        id={id}
        onChange={(event) => onSelect(event.target.value)}
        value={value}
      >
        {options}
      </select>
    </div>
  );
};
