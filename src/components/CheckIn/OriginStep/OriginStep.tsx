'use client';

import ScrollArea from '@/components/ScrollArea/ScrollArea';
import { useRecentStations } from '@/hooks/useRecentStations/useRecentStations';
import { useStationSearch } from '@/hooks/useStationSearch/useStationSearch';
import classNames from 'classnames';
import { useContext } from 'react';
import { CheckInContext } from '../CheckIn.context';
import Search from '../Search/Search';
import styles from './OriginStep.module.scss';
import { StationProps } from './types';

const OriginStep = () => {
  const { isOpen, query } = useContext(CheckInContext);
  const { recentStations } = useRecentStations();
  const { stations } = useStationSearch(query);

  return (
    <main className={classNames(styles.base, { [styles.isOpen]: isOpen })}>
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
                          onClick={() => void 0}
                          query={query}
                          rilIdentifier={station.rilIdentifier}
                        />
                      </li>
                    ))}
                  </ul>
                )}
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
                        onClick={() => void 0}
                        rilIdentifier={station.rilIdentifier}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </ScrollArea>
      )}
    </main>
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
