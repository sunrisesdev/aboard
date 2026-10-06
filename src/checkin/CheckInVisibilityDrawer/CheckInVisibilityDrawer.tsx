'use client';

import { Drawer } from '@base-ui/react/drawer';
import { IconChevronRight } from '@tabler/icons-react';
import { useId, useState } from 'react';
import { visibilityOptions } from '@/checkin/visibilityOptions';
import { BottomDrawer } from '@/components/BottomDrawer/BottomDrawer';
import { RadioCards } from '@/components/RadioCards/RadioCards';
import type { StatusVisibility } from '@/lib/traewelling';
import styles from './CheckInVisibilityDrawer.module.css';

export const CheckInVisibilityDrawer = ({
  onValueChange,
  value,
}: {
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
        <Drawer.Trigger aria-labelledby={valueId} className={styles.trigger}>
          {selectedOption?.icon && <div className={styles.iconContainer}>{selectedOption?.icon}</div>}

          <div id={valueId}>
            <div className={styles.label}>Sichtbarkeit</div>
            <span style={{ fontWeight: 500 }}>{selectedOption?.label}</span>
          </div>

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
