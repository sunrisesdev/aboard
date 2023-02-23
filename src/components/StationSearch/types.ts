import { Station } from '@/traewelling-sdk/types';

export type StationSearchProps = {
  onStationSelect: (station: Pick<Station, 'name' | 'rilIdentifier'>) => void;
};

export type StationSuggestionProps = {
  name: string;
  onClick?: () => void;
  query: string;
  rilIdentifier: string | null;
};
