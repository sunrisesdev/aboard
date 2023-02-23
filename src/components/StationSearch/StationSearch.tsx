import { AutocompleteResponse } from '@/traewelling-sdk/functions/trains';
import { debounce } from '@/utils/debounce';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useState } from 'react';
import { MdOutlineShareLocation } from 'react-icons/md';
import useSWR from 'swr';
import Button from '../Button/Button';
import ScrollArea from '../ScrollArea/ScrollArea';
import styles from './StationSearch.module.scss';
import { StationSearchProps, StationSuggestionProps } from './types';

const fetcher = async (
  query: string,
  token?: string
): Promise<AutocompleteResponse> => {
  if (!token || (query.trim().length > 0 && query.trim().length < 2)) {
    return [];
  }

  if (!query.trim()) {
    const response = await fetch('/api/stations/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  }

  const response = await fetch(`/api/stations/autocomplete?query=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  return await response.json();
};

const StationSearch = ({ onStationSelect }: StationSearchProps) => {
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const { data: suggestions } = useSWR(
    ['/api/stations/autocomplete', query, session?.traewelling.token],
    ([_, query, token]) => fetcher(query, token)
  );

  // TODO: Improve sorting
  // const suggestions = !data
  //   ? undefined
  //   : sortByLevenshtein(data, (e) => e.name, query);

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

        <Button>
          <MdOutlineShareLocation size={22} />
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
      </ScrollArea>
    </div>
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
