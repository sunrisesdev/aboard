import { sourceSans3 } from '@/styles/fonts';
import { AutocompleteResponse } from '@/traewelling-sdk/functions/trains';
import { debounce } from '@/utils/debounce';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useState } from 'react';
import useSWR from 'swr';
import styles from './StationSearch.module.scss';

const fetcher = async (
  query: string,
  token?: string
): Promise<AutocompleteResponse> => {
  if (!query.trim() || !token || query.length < 2) {
    return [];
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

const StationSearch = () => {
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
    <div className={classNames(styles.base, sourceSans3.className)}>
      <input
        className={styles.input}
        onChange={handleQueryChange}
        value={inputValue}
      />

      {suggestions && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((suggestion) => (
            <li key={suggestion.ibnr}>
              <StationSuggestion
                ibnr={suggestion.ibnr}
                name={suggestion.name}
                query={query}
                rilIdentifier={suggestion.rilIdentifier}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const StationSuggestion = ({
  ibnr,
  name,
  query,
  rilIdentifier,
}: {
  ibnr: number;
  name: string;
  query: string;
  rilIdentifier: string | null;
}) => {
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
        __html: extendedName.replaceAll(queryPattern, '<mark>$1</mark>'),
      }}
    />
  );
};

export default StationSearch;
