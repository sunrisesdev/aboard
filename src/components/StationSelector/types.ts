import { AboardStation } from '@/types/aboard';

export type StationProps = {
  onClick?: () => void;
  query?: string;
  station: AboardStation;
};

export type StationSelectorProps = {
  onSelect: (station: AboardStation) => void;
  query?: string;
  stations: AboardStation[];
};
