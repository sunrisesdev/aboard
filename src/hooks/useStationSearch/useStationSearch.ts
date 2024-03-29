import { AutocompleteResponse } from '@/traewelling-sdk/functions/trains';
import { Station } from '@/traewelling-sdk/types';
import levenshtein from 'js-levenshtein';
import useSWR from 'swr';

const fetcher = async (query: string): Promise<AutocompleteResponse> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const response = await fetch(
    `/traewelling/stations/autocomplete?query=${query}`
  );

  if (!response.ok) {
    return [];
  }

  return await response.json();
};

const getMatchDetails = (
  { name, rilIdentifier }: Pick<Station, 'name' | 'rilIdentifier'>,
  queryPattern: RegExp
) => {
  const extendedName = `${name}${!rilIdentifier ? '' : ` (${rilIdentifier})`}`;

  const matchedLength = Array.from(extendedName.matchAll(queryPattern))
    .flat()
    .reduce((acc, cur) => acc + cur.length, 0);

  return [matchedLength / extendedName.length, extendedName] as const;
};

export const useStationSearch = (query: string) => {
  const { data, isLoading } = useSWR(
    ['/traewelling/stations/autocomplete', query],
    ([_, query]) => fetcher(query)
  );

  const escapedQuery = query.replaceAll(/[\|\.\(\)\/\?\*\+\$\^\\]/gi, '');
  const queryPattern = new RegExp(
    `(${escapedQuery.trim().split(' ').join('|')})`,
    'gi'
  );

  const stations = data?.sort((a, b) => {
    const [valueA, nameA] = getMatchDetails(a, queryPattern);
    const [valueB, nameB] = getMatchDetails(b, queryPattern);

    // Always prioritize RIL identifiers
    if (a.rilIdentifier === query) {
      return -1;
    } else if (b.rilIdentifier === query) {
      return 1;
    }

    // Sort elements by the percentage they match
    if (valueA > valueB) {
      return -1;
    }

    if (valueA < valueB) {
      return 1;
    }

    if (valueA !== 0 && valueB !== 0) {
      return 0;
    }

    // Sort elements without any direct matches by levensthein distance
    return levenshtein(nameA, query) - levenshtein(nameB, query);
  });

  return {
    isLoading,
    stations,
  };
};
