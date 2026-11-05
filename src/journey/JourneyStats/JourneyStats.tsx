import { IconClockHour4Filled, IconNavigationFilled, IconStarsFilled } from '@tabler/icons-react';
import { StatCards } from '@/components/StatCards/StatCards';
import { formatMinutes } from '@/helpers/duration';
import { formatDistance } from '@/helpers/formatDistance';
import type { Extend, Structure } from '@/types/extend';

/**
 * @param distance In meters
 * @param duration In minutes
 */
export const JourneyStats = ({
  distance,
  duration,
  points,
  pointsEnabled,
  ...props
}: Extend<Structure, { distance: number; duration: number; points: number; pointsEnabled: boolean }>) => {
  return (
    <StatCards {...props}>
      <StatCards.Item
        color="#008754"
        isWide
        labelSlot="Strecke"
        signetSlot={<IconNavigationFilled data-via-icon />}
        valueSlot={formatDistance(distance)}
      />

      <StatCards.Item
        color="#992572"
        isWide={!pointsEnabled}
        labelSlot="Reisedauer"
        signetSlot={<IconClockHour4Filled data-via-icon />}
        valueSlot={formatMinutes(duration)}
      />

      {pointsEnabled && (
        <StatCards.Item
          color="#EFAF00"
          signetSlot={<IconStarsFilled data-via-icon />}
          valueSlot={`${points.toLocaleString('de-DE')} Punkte`}
        />
      )}
    </StatCards>
  );
};
