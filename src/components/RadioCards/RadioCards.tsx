'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { clsx } from 'clsx';
import type { CSSProperties, ReactNode } from 'react';
import type { Extend, Structure } from '@/helpers/extend';
import styles from './RadioCards.module.css';

export type RadioCardsOption<Value> = {
  description?: ReactNode;
  icon?: ReactNode;
  label: ReactNode;
  value: Value;
};

export const RadioCards = <Value,>({
  className,
  columns = 1,
  onValueChange,
  options,
  style,
  ...props
}: Extend<
  Structure,
  {
    'aria-labelledby'?: string;
    columns?: number;
    onValueChange?: (value: Value) => void;
    options: RadioCardsOption<Value>[];
    value?: Value;
  }
>) => {
  return (
    <RadioGroup
      className={clsx(styles.base, className)}
      onValueChange={(nextValue) => onValueChange?.(nextValue as Value)}
      style={{ ...style, '--via-radio-cards-columns': columns } as CSSProperties}
      {...props}
    >
      {options.map((option) => (
        <Radio.Root
          className={styles.item}
          key={String(option.value)}
          nativeButton
          render={<button type="button" />}
          value={option.value}
        >
          {option.icon && <span className={styles.icon}>{option.icon}</span>}
          <span className={styles.label}>{option.label}</span>
          {option.description && <span className={styles.description}>{option.description}</span>}
          <span aria-hidden className={styles.indicator} />
        </Radio.Root>
      ))}
    </RadioGroup>
  );
};
