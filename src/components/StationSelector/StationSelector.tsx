import styles from './StationSelector.module.scss';
import { StationProps, StationSelectorProps } from './types';

export const StationSelector = ({
  onSelect,
  query,
  stations,
}: StationSelectorProps) => {
  return (
    <ul className={styles.base}>
      {stations.map((station, index) => (
        <li key={index}>
          <Station
            onClick={() => onSelect(station)}
            query={query}
            station={station}
          />
        </li>
      ))}
    </ul>
  );
};

const Station = ({ onClick, query, station }: StationProps) => {
  const escapedQuery = query?.replaceAll(/[\|\.\(\)\/\?\*\+\$\^\\]/gi, '');
  const queryPattern = new RegExp(
    `(${escapedQuery?.trim().split(' ').join('|')})`,
    'gi'
  );

  const extendedName = `${station.name}${
    !station.rilId ? '' : ` (${station.rilId})`
  }`;

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
