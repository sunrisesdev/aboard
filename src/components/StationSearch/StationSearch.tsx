import {
  AutocompleteResponse,
  NearbyResponse,
} from '@/traewelling-sdk/functions/trains';
import { debounce } from '@/utils/debounce';
import clsx from 'clsx';
import { Session } from 'next-auth';
import { ChangeEvent, useEffect, useState } from 'react';
import { CgSpinnerTwoAlt } from 'react-icons/cg';
import {
  MdCheck,
  MdOutlineShareLocation,
  MdOutlineWrongLocation,
} from 'react-icons/md';
import useSWR from 'swr';
import Button from '../Button/Button';
import ScrollArea from '../ScrollArea/ScrollArea';
import Shimmer from '../Shimmer/Shimmer';
import styles from './StationSearch.module.scss';
import { StationSearchProps, StationSuggestionProps } from './types';

const fetcher = async (
  query: string,
  session?: Session | null
): Promise<AutocompleteResponse> => {
  const token = session?.user.accessToken;

  if (!token || (query.trim().length > 0 && query.trim().length < 2)) {
    return [];
  }

  if (!query.trim()) {
    const response = await fetch('/traewelling/stations/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  }

  const response = await fetch(
    `/traewelling/stations/autocomplete?query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return [];
  }

  return await response.json();
};

const StationSearch = ({ onStationSelect }: StationSearchProps) => {
  const [inputValue, setInputValue] = useState('');
  const [locationStatus, setLocationStatus] = useState<
    'unknown' | 'loading' | 'success' | 'error'
  >('unknown');
  const [query, setQuery] = useState('');
  const { data: suggestions, isLoading } = useSWR(
    ['/traewelling/stations/autocomplete', query],
    ([_, query]) => fetcher(query)
  );

  // TODO: Improve sorting
  // const suggestions = !data
  //   ? undefined
  //   : sortByLevenshtein(data, (e) => e.name, query);

  useEffect(() => {
    if (['error', 'success'].includes(locationStatus)) {
      setTimeout(() => setLocationStatus('unknown'), 3000);
    }
  }, [locationStatus]);

  const handleNearbyClick = () => {
    setLocationStatus('loading');

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const response = await fetch(
          `/traewelling/stations/nearby?latitude=${coords.latitude}&longitude=${coords.longitude}`
        );

        if (!response.ok) {
          setLocationStatus('error');
          return;
        }

        const station = (await response.json()) as NearbyResponse;
        onStationSelect({
          name: station.name,
          rilIdentifier: station.rilIdentifier,
        });

        setLocationStatus('success');
      },
      () => {
        setLocationStatus('error');
      }
    );
  };

  const handleQueryChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setInputValue(ev.target.value);

    debounce(
      (ev: ChangeEvent<HTMLInputElement>) => setQuery(ev.target.value),
      500
    )(ev);
  };

  return (
    <div className={styles.base}>
      <div className={styles.header}>
        <input
          className={styles.input}
          onChange={handleQueryChange}
          value={inputValue}
        />

        <Button
          onClick={handleNearbyClick}
          variant={
            ['unknown', 'loading'].includes(locationStatus)
              ? undefined
              : (locationStatus as any)
          }
        >
          {locationStatus === 'unknown' && <MdOutlineShareLocation size={22} />}
          {locationStatus === 'loading' && (
            <CgSpinnerTwoAlt className={styles.isLoading} size={22} />
          )}
          {locationStatus === 'success' && <MdCheck size={22} />}
          {locationStatus === 'error' && <MdOutlineWrongLocation size={22} />}
        </Button>
      </div>

      <ScrollArea className={styles.scrollArea}>
        {suggestions && suggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.map((suggestion) => (
              <li key={suggestion.ibnr}>
                <StationSuggestion
                  name={suggestion.name}
                  onClick={() => onStationSelect(suggestion)}
                  query={query}
                  rilIdentifier={suggestion.rilIdentifier}
                />
              </li>
            ))}
          </ul>
        )}

        {isLoading && (
          <ul className={styles.suggestions}>
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
      </ScrollArea>
    </div>
  );
};

const StationSkeleton = () => {
  const width = Math.random() * (85 - 50) + 50;

  return (
    <button className={clsx(styles.suggestion, styles.isSkeleton)}>
      <Shimmer width={`${width}%`} />
    </button>
  );
};

const StationSuggestion = ({
  name,
  onClick,
  query,
  rilIdentifier,
}: StationSuggestionProps) => {
  const escapedQuery = query.replaceAll(/[\|\.\(\)\/\?\*\+\$\^\\]/gi, '');
  const queryPattern = new RegExp(
    `(${escapedQuery.trim().split(' ').join('|')})`,
    'gi'
  );

  const extendedName = `${name}${!rilIdentifier ? '' : ` (${rilIdentifier})`}`;

  return (
    <button
      className={styles.suggestion}
      dangerouslySetInnerHTML={{
        __html: extendedName
          .replaceAll(queryPattern, '<mark>$1</mark>')
          .replaceAll(/\s/g, '&nbsp;'),
      }}
      onClick={onClick}
    />
  );
};

export default StationSearch;
