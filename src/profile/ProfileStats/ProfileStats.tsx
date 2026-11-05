import { IconClockHour4Filled, IconNavigationFilled, IconStarsFilled } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { StatCards } from '@/components/StatCards/StatCards';
import { formatMinutes } from '@/helpers/duration';
import { formatDistance } from '@/helpers/formatDistance';
import type { UserProfile } from '@/lib/traewelling';
import type { Extend, Structure } from '@/types/extend';
import styles from './ProfileStats.module.css';

// In meters
const earthCircumference = 40_075_000;

export const ProfileStats = ({ className, user, ...props }: Extend<Structure, { user: UserProfile }>) => {
  const earthLaps = (user.totalDistance / earthCircumference).toLocaleString('de-DE', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  });

  return (
    <details className={clsx(styles.base, className)} {...props}>
      <summary className={styles.toggle}>
        <span className={styles.showLabel}>Statistiken anzeigen</span>
        <span className={styles.hideLabel}>Statistiken ausblenden</span>
      </summary>

      <StatCards className={styles.stats}>
        <StatCards.Item
          color="#008754"
          descriptionSlot={<>circa {earthLaps}&times; um die Erde</>}
          isWide
          labelSlot="Strecke"
          signetSlot={<IconNavigationFilled data-via-icon />}
          valueSlot={formatDistance(user.totalDistance)}
        />

        <StatCards.Item
          color="#992572"
          descriptionSlot={formatMinutes(user.totalDuration, { abbreviate: false })}
          isWide={!user.pointsEnabled}
          labelSlot="Reisedauer"
          signetSlot={<IconClockHour4Filled data-via-icon />}
          valueSlot={user.totalDuration.toLocaleString('de-DE', { style: 'unit', unit: 'minute' })}
        />

        {user.pointsEnabled && (
          <StatCards.Item
            color="#EFAF00"
            signetSlot={<IconStarsFilled data-via-icon />}
            valueSlot={`${user.points.toLocaleString('de-DE')} Punkte`}
          />
        )}
      </StatCards>
    </details>
  );
};
