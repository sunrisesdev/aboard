'use client';

import { Menu } from '@base-ui/react/menu';
import { IconCheck, IconChevronDown, IconFilter2, IconFilter2X } from '@tabler/icons-react';
import type { ComponentProps } from 'react';
import { Button } from '@/components/Button/Button';
import { TransportModeIcon } from '@/components/TransportModeIcon/TransportModeIcon';
import type { TravelType } from '@/lib/traewelling';
import { useStationboard } from '@/station/Stationboard/useStationboard';
import styles from './StationboardTravelTypeFilter.module.css';

const travelTypeLabels: Record<TravelType, string> = {
  express: 'Fernzug',
  regional: 'Regionalzug',
  suburban: 'S-Bahn',
  subway: 'U-Bahn',
  tram: 'Tram',
  bus: 'Bus',
  taxi: 'Fernbus',
  ferry: 'Fähre',
  plane: 'Flugzeug',
};

const travelTypeIcons: Record<TravelType, NonNullable<ComponentProps<typeof TransportModeIcon>['icon']>[]> = {
  express: ['high-speed', 'long-distance'],
  regional: ['regional'],
  suburban: ['suburban'],
  subway: ['subway'],
  tram: ['tram'],
  bus: ['bus'],
  taxi: ['coach'],
  ferry: ['ferry'],
  plane: ['plane'],
};

const TravelTypeIcons = ({ travelType }: { travelType: TravelType }) => (
  <span className={styles.icons}>
    {travelTypeIcons[travelType].map((icon) => (
      <TransportModeIcon icon={icon} key={icon} />
    ))}
  </span>
);

// Radio items need a value, so "all travel types" gets a placeholder instead of undefined
const allTravelTypes = 'all';

export const StationboardTravelTypeFilter = () => {
  const { changeTravelType, travelType } = useStationboard();

  return (
    <Menu.Root>
      <Menu.Trigger
        render={
          <Button
            alignStart
            leadingSlot={
              travelType ? <TravelTypeIcons travelType={travelType} /> : <IconFilter2 aria-hidden data-via-icon />
            }
            trailingSlot={<IconChevronDown aria-hidden data-via-icon />}
            variant="secondary"
          />
        }
      >
        <span>{travelType ? travelTypeLabels[travelType] : 'Verkehrsmittel'}</span>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner align="end" alignOffset={-4} className={styles.positioner} sideOffset={4}>
          <Menu.Popup className={styles.popup}>
            <Menu.RadioGroup
              onValueChange={(value: string) =>
                changeTravelType(value === allTravelTypes ? undefined : (value as TravelType))
              }
              value={travelType ?? allTravelTypes}
            >
              <Menu.RadioItem className={styles.item} closeOnClick value={allTravelTypes}>
                <IconFilter2X aria-hidden data-via-icon />
                Alle Verkehrsmittel
                <Menu.RadioItemIndicator className={styles.indicator}>
                  <IconCheck aria-hidden data-via-icon />
                </Menu.RadioItemIndicator>
              </Menu.RadioItem>

              <Menu.Separator className={styles.separator} />

              {Object.entries(travelTypeLabels).map(([type, label]) => (
                <Menu.RadioItem className={styles.item} closeOnClick key={type} value={type}>
                  <TravelTypeIcons travelType={type as keyof typeof travelTypeIcons} />
                  {label}
                  <Menu.RadioItemIndicator className={styles.indicator}>
                    <IconCheck aria-hidden data-via-icon />
                  </Menu.RadioItemIndicator>
                </Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};
