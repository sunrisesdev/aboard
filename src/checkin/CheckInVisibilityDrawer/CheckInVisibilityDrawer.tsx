'use client';

import { Drawer } from '@base-ui/react/drawer';
import { IconChevronRight } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { useId, useState } from 'react';
import { visibilityOptions } from '@/checkin/visibilityOptions';
import { BottomDrawer } from '@/components/BottomDrawer/BottomDrawer';
import { RadioCards } from '@/components/RadioCards/RadioCards';
import type { StatusVisibility } from '@/lib/traewelling';
import styles from './CheckInVisibilityDrawer.module.css';

// Nested inside CheckInBottomDrawer, the trigger shows the current value and opens the options in another drawer.
export const CheckInVisibilityDrawer = ({
  'aria-labelledby': ariaLabelledBy,
  onValueChange,
  value,
}: {
  'aria-labelledby'?: string;
  onValueChange: (value: StatusVisibility) => void;
  value: StatusVisibility;
}) => {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const valueId = useId();
  const selectedOption = visibilityOptions.find((option) => option.value === value);

  return (
    <BottomDrawer
      nested
      onOpenChange={setOpen}
      open={open}
      trigger={
        <Drawer.Trigger aria-labelledby={clsx(ariaLabelledBy, valueId)} className={styles.trigger}>
          {selectedOption?.icon}
          <span className={styles.value} id={valueId}>
            {selectedOption?.label}
          </span>
          <IconChevronRight className={styles.chevron} data-via-icon />
        </Drawer.Trigger>
      }
    >
      <Drawer.Title className={styles.title} id={titleId}>
        Sichtbarkeit
      </Drawer.Title>

      <BottomDrawer.Content>
        <RadioCards<StatusVisibility>
          aria-labelledby={titleId}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setOpen(false);
          }}
          options={visibilityOptions}
          value={value}
        />
      </BottomDrawer.Content>
    </BottomDrawer>
  );
};
