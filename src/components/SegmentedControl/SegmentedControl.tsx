'use client';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { clsx } from 'clsx';
import { type CSSProperties, type ReactNode, useState } from 'react';
import type { Extend, Structure } from '@/helpers/extend';
import styles from './SegmentedControl.module.css';

export type SegmentedControlOption<Value> = {
  icon?: ReactNode;
  label: ReactNode;
  value: Value;
};

export const SegmentedControl = <Value,>({
  className,
  defaultValue,
  name,
  options,
  style,
  ...props
}: Extend<
  Structure,
  {
    'aria-labelledby'?: string;
    defaultValue?: Value;
    name?: string;
    options: SegmentedControlOption<Value>[];
  }
>) => {
  const [value, setValue] = useState(defaultValue);
  const selectedIndex = options.findIndex((option) => option.value === value);

  return (
    <RadioGroup
      className={clsx(styles.base, className)}
      name={name}
      onValueChange={(nextValue) => setValue(nextValue as Value)}
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
      <div aria-hidden className={styles.indicator} data-hidden={selectedIndex < 0 || undefined} />

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
