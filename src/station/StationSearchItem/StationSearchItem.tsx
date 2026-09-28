import { clsx } from 'clsx';
import Link from 'next/link';
import { Badge } from '@/components/Badge/Badge';
import type { Extend } from '@/helpers/extend';
import type { StationResource } from '@/lib/traewelling';
import styles from './StationSearchItem.module.css';

export const StationSearchItem = ({ className, station, ...props }: Extend<'div', { station: StationResource }>) => {
  const rilIdentifier = station.identifiers?.find(({ type }) => type === 'de_db_ril100')?.identifier;

  return (
    <div className={clsx(styles.base, className)} {...props}>
      <Link className={styles.link} href={`/station/${station.id}?${new URLSearchParams({ name: station.name })}`}>
        {station.name}
        {rilIdentifier && <Badge style={{ marginLeft: '1ch' }}>{rilIdentifier}</Badge>}
      </Link>

      {!!station.areas?.length && (
        <div>
          {station.areas
            .toSorted((a, b) => b.adminLevel - a.adminLevel)
            .map(({ name }) => name)
            .join(', ')}
        </div>
      )}
    </div>
  );
};
