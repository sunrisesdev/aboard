'use client';

import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { use } from 'react';
import { TintedSurface } from '@/components/TintedSurface/TintedSurface';
import { cleanStationName } from '@/helpers/cleanStationName';
import { getLineColors } from '@/helpers/getLineColors';
import { useCurrentStatuses } from '@/status/useCurrentStatuses';
import styles from './ActiveStatus.module.css';

// Placeholder design: only the route of the active check-in and the one after it
export const ActiveStatus = ({ className }: { className?: string }) => {
  const { active, next } = use(useCurrentStatuses().currentStatusesPromise);

  if (!active) return null;

  const { checkin } = active;

  return (
    <TintedSurface
      className={className}
      color={getLineColors({ color: checkin.routeColor, mode: checkin.mode }).background}
      radius="1rem"
    >
      <TintedSurface.Content>
        <Link className={styles.link} href={`/status/${active.id}`}>
          <div className={styles.route}>
            <span className={styles.station}>{cleanStationName(checkin.origin.station.name)}</span>
            <IconArrowRight className={styles.arrow} size={16} stroke={2} />
            <span className={styles.station}>{cleanStationName(checkin.destination.station.name)}</span>
          </div>

          {next && (
            <div className={styles.next}>
              Danach: {cleanStationName(next.checkin.origin.station.name)} →{' '}
              {cleanStationName(next.checkin.destination.station.name)}
            </div>
          )}
        </Link>
      </TintedSurface.Content>
    </TintedSurface>
  );
};
