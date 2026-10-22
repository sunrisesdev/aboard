'use client';

import { Menu } from '@base-ui/react/menu';
import { IconCheck, IconChevronDown, IconTiltShiftFilled, IconTiltShiftOff } from '@tabler/icons-react';
import { Button } from '@/components/Button/Button';
import { useStationboard } from '@/station/Stationboard/useStationboard';
import styles from './StationboardRadiusFilter.module.css';

// Radio items need a value, so the API's default radius gets a placeholder instead of undefined
const nearbyStations = 'nearby';

export const StationboardRadiusFilter = () => {
  const { changeRadius, radius } = useStationboard();

  return (
    <Menu.Root>
      <Menu.Trigger
        render={
          <Button
            alignStart
            leadingSlot={
              radius === 10 ? (
                <IconTiltShiftOff aria-hidden data-via-icon />
              ) : (
                <IconTiltShiftFilled aria-hidden data-via-icon />
              )
            }
            trailingSlot={<IconChevronDown aria-hidden data-via-icon />}
            variant="secondary"
          />
        }
      >
        <span>{radius === 10 ? 'Nur Station' : 'Umgebung'}</span>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner align="start" alignOffset={-4} className={styles.positioner} sideOffset={4}>
          <Menu.Popup className={styles.popup}>
            <Menu.RadioGroup
              onValueChange={(value: typeof nearbyStations | 10) =>
                changeRadius(value === nearbyStations ? undefined : value)
              }
              value={radius ?? nearbyStations}
            >
              <Menu.RadioItem className={styles.item} closeOnClick value={nearbyStations}>
                <IconTiltShiftFilled aria-hidden data-via-icon />
                Inkl. Abfahrten in der Umgebung
                <Menu.RadioItemIndicator className={styles.indicator}>
                  <IconCheck aria-hidden data-via-icon />
                </Menu.RadioItemIndicator>
              </Menu.RadioItem>

              <Menu.RadioItem className={styles.item} closeOnClick value={10}>
                <IconTiltShiftOff aria-hidden data-via-icon />
                Nur Abfahrten von dieser Station
                <Menu.RadioItemIndicator className={styles.indicator}>
                  <IconCheck aria-hidden data-via-icon />
                </Menu.RadioItemIndicator>
              </Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};
