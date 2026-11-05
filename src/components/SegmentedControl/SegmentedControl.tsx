'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { clsx } from 'clsx';
import type { CSSProperties, ReactNode } from 'react';
import type { Extend, Structure } from '@/types/extend';
import styles from './SegmentedControl.module.css';

export type SegmentedControlOption<Value> = {
  icon?: ReactNode;
  label: ReactNode;
  value: Value;
};

export const SegmentedControl = <Value,>({
  className,
  onValueChange,
  options,
  style,
  value,
  ...props
}: Extend<
  Structure,
  {
    'aria-labelledby'?: string;
    onValueChange?: (value: Value) => void;
    options: SegmentedControlOption<Value>[];
    value?: Value;
  }
>) => {
  const selectedIndex = options.findIndex((option) => option.value === value);

  return (
    <RadioGroup
      className={clsx(styles.base, className)}
      onValueChange={(nextValue) => onValueChange?.(nextValue as Value)}
      style={
        {
          ...style,
          '--via-segmented-control-count': options.length,
          '--via-segmented-control-index': selectedIndex,
        } as CSSProperties
      }
      value={value}
      {...props}
    >
      <div aria-hidden className={styles.indicator} data-via-hidden={selectedIndex < 0 || undefined} />

      {options.map((option) => (
        <Radio.Root
          className={styles.item}
          key={String(option.value)}
          nativeButton
          render={<button type="button" />}
          value={option.value}
        >
          {option.icon}
          {option.label}
        </Radio.Root>
      ))}
    </RadioGroup>
  );
};
