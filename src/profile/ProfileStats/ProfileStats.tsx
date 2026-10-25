import { IconClockHour4Filled, IconNavigationFilled, IconStarsFilled } from '@tabler/icons-react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { SubtleTintedSurface } from '@/components/TintedSurface/SubtleTintedSurface';
import type { Extend, Structure } from '@/helpers/extend';
import { formatDistance } from '@/helpers/formatDistance';
import { formatMinutes } from '@/helpers/formatMinutes';
import type { UserProfile } from '@/lib/traewelling';
import styles from './ProfileStats.module.css';

// In meters
const earthCircumference = 40_075_000;

const Stat = ({
  color,
  descriptionSlot,
  isWide,
  labelSlot,
  signetSlot,
  valueSlot,
}: {
  color: string;
  descriptionSlot?: ReactNode;
  isWide?: boolean;
  labelSlot?: ReactNode;
  signetSlot: ReactNode;
  valueSlot: ReactNode;
}) => {
  return (
    <SubtleTintedSurface className={clsx(styles.stat, isWide && styles.isWide)} color={color} radius="0.75rem">
      <SubtleTintedSurface.Content className={styles.content}>
        {labelSlot && <div className={styles.label}>{labelSlot}</div>}
        <div className={styles.value}>{valueSlot}</div>
        {descriptionSlot && <em className={styles.description}>{descriptionSlot}</em>}

        <span aria-hidden className={styles.signet}>
          {signetSlot}
        </span>
      </SubtleTintedSurface.Content>
    </SubtleTintedSurface>
  );
};

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

      <div className={styles.stats}>
        <Stat
          color="#008754"
          descriptionSlot={<>circa {earthLaps}&times; um die Erde</>}
          isWide
          labelSlot="Strecke"
          signetSlot={<IconNavigationFilled data-via-icon />}
          valueSlot={formatDistance(user.totalDistance)}
        />

        <Stat
          color="#992572"
          descriptionSlot={formatMinutes(user.totalDuration, { abbreviate: false })}
          isWide={!user.pointsEnabled}
          labelSlot="Reisedauer"
          signetSlot={<IconClockHour4Filled data-via-icon />}
          valueSlot={user.totalDuration.toLocaleString('de-DE', { style: 'unit', unit: 'minute' })}
        />

        {user.pointsEnabled && (
          <Stat
            color="#EFAF00"
            signetSlot={<IconStarsFilled data-via-icon />}
            valueSlot={`${user.points.toLocaleString('de-DE')} Punkte`}
          />
        )}
      </div>
    </details>
  );
};
