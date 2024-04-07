import { AboardAutocompleteResponse } from '@/app/api/stations/autocomplete/route';
import { AboardStation } from '@/types/aboard';
import levenshtein from 'js-levenshtein';
import useSWR from 'swr';

const fetcher = async (query: string): Promise<AboardAutocompleteResponse> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const response = await fetch(`/api/stations/autocomplete?query=${query}`);

  if (!response.ok) {
    return [];
  }

  return await response.json();
};

const getMatchDetails = (
  { name, rilId }: AboardStation,
  queryPattern: RegExp
) => {
  const extendedName = `${name}${!rilId ? '' : ` (${rilId})`}`;

  const matchedLength = Array.from(extendedName.matchAll(queryPattern))
    .flat()
    .reduce((acc, cur) => acc + cur.length, 0);

  return [matchedLength / extendedName.length, extendedName] as const;
};

export const useStationSearch = (query: string) => {
  const { data, isLoading } = useSWR(
    ['/api/stations/autocomplete', query],
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
    if (a.rilId === query) {
      return -1;
    } else if (b.rilId === query) {
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
