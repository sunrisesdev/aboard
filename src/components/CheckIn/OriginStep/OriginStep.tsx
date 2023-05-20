'use client';

import ScrollArea from '@/components/ScrollArea/ScrollArea';
import Shimmer from '@/components/Shimmer/Shimmer';
import { LiveCheckInContext } from '@/contexts/LiveCheckIn/LiveCheckIn.context';
import { useRecentStations } from '@/hooks/useRecentStations/useRecentStations';
import { useStationSearch } from '@/hooks/useStationSearch/useStationSearch';
import clsx from 'clsx';
import { useContext } from 'react';
import { CheckInContext } from '../CheckIn.context';
import Search from '../Search/Search';
import styles from './OriginStep.module.scss';
import { StationProps } from './types';

const OriginStep = () => {
  const { isOpen, query, setOrigin } = useContext(CheckInContext);
  const { journey } = useContext(LiveCheckInContext);
  const { isLoading: isLoadingRecentStations, recentStations } =
    useRecentStations();
  const { isLoading: isLoadingStations, stations } = useStationSearch(query);

  return (
    <main className={clsx(styles.base, { [styles.isOpen]: isOpen })}>
      <section className={styles.container}>
        <Search />
      </section>

      {isOpen && (
        <ScrollArea className={styles.scrollArea}>
          <div className={styles.scrollContent}>
            {query.length > 0 && (
              <section className={styles.container}>
                <div className={styles.title}>Suchergebnisse</div>
                {stations && stations.length > 0 && (
                  <ul className={styles.stationList}>
                    {stations.map((station) => (
                      <li key={station.ibnr}>
                        <Station
                          name={station.name}
                          onClick={() => setOrigin(station)}
                          query={query}
                          rilIdentifier={station.rilIdentifier}
                        />
                      </li>
                    ))}
                  </ul>
                )}

                {isLoadingStations && (
                  <ul className={styles.stationList}>
                    <li>
                      <StationSkeleton />
                    </li>
                    <li>
                      <StationSkeleton />
                    </li>
                    <li>
                      <StationSkeleton />
                    </li>
                    <li>
                      <StationSkeleton />
                    </li>
                    <li>
                      <StationSkeleton />
                    </li>
                  </ul>
                )}
              </section>
            )}

            {journey.length > 0 && (
              <section className={styles.container}>
                <div className={styles.title}>Live Check-In fortsetzen</div>
                <ul className={styles.stationList}>
                  <li>
                    <Station
                      name={journey.at(-1)!.destination.name}
                      onClick={() =>
                        setOrigin({
                          ibnr: journey.at(-1)!.destination.id,
                          name: journey.at(-1)!.destination.name,
                          rilIdentifier:
                            journey.at(-1)!.destination.rilIdentifier,
                        })
                      }
                      query={query}
                      rilIdentifier={journey.at(-1)!.destination.rilIdentifier}
                    />
                  </li>
                </ul>
              </section>
            )}

            <section className={styles.container}>
              <div className={styles.title}>Letzte Stationen</div>
              {recentStations && recentStations.length > 0 && (
                <ul className={styles.stationList}>
                  {recentStations.map((station) => (
                    <li key={station.ibnr}>
                      <Station
                        name={station.name}
                        onClick={() => setOrigin(station)}
                        rilIdentifier={station.rilIdentifier}
                      />
                    </li>
                  ))}
                </ul>
              )}

              {isLoadingRecentStations && (
                <ul className={styles.stationList}>
                  <li>
                    <StationSkeleton />
                  </li>
                  <li>
                    <StationSkeleton />
                  </li>
                  <li>
                    <StationSkeleton />
                  </li>
                  <li>
                    <StationSkeleton />
                  </li>
                  <li>
                    <StationSkeleton />
                  </li>
                </ul>
              )}
            </section>
          </div>
        </ScrollArea>
      )}
    </main>
  );
};

const StationSkeleton = () => {
  const width = Math.random() * (85 - 50) + 50;

  return (
    <button className={clsx(styles.station, styles.isSkeleton)}>
      <Shimmer width={`${width}%`} />
    </button>
  );
};

const Station = ({
  name,
  onClick,
  query = '',
  rilIdentifier,
}: StationProps) => {
  const escapedQuery = query.replaceAll(/[\|\.\(\)\/\?\*\+\$\^\\]/gi, '');
  const queryPattern = new RegExp(
    `(${escapedQuery.trim().split(' ').join('|')})`,
    'gi'
  );

  const extendedName = `${name}${!rilIdentifier ? '' : ` (${rilIdentifier})`}`;

  return (
    <button
      className={styles.station}
      dangerouslySetInnerHTML={{
        __html: extendedName
          .replaceAll(queryPattern, '<mark>$1</mark>')
          .replaceAll(/\s/g, '&nbsp;'),
      }}
      onClick={onClick}
    />
  );
};

export default OriginStep;
