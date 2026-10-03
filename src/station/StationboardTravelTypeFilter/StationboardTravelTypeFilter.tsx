'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import type { TravelType } from '@/lib/traewelling';
import { useStationboard } from '@/station/Stationboard/useStationboard';
import styles from './StationboardTravelTypeFilter.module.css';

const travelTypeLabels: Record<Exclude<TravelType, 'taxi'>, string> = {
  express: 'Fern',
  regional: 'Regional',
  suburban: 'S-Bahn',
  subway: 'U-Bahn',
  tram: 'Tram',
  bus: 'Bus',
  ferry: 'Fähre',
  plane: 'Flugzeug',
};

export const StationboardTravelTypeFilter = () => {
  const { changeTravelType, travelType } = useStationboard();

  return (
    <ToggleGroup
      className={styles.filterGroup}
      value={travelType ? [travelType] : []}
      onValueChange={([next]) => changeTravelType(next)}
      aria-label="Verkehrsmittel"
    >
      {Object.entries(travelTypeLabels).map(([type, label]) => (
        <Toggle key={type} value={type} className={styles.filterToggle}>
          {label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
};
