import { AboardStopover } from '@/types/aboard';

export type StopoverProps = {
  onClick?: () => void;
  stopover: AboardStopover;
};

export type StopoverSelectorProps = {
  onSelect: (value: AboardStopover) => void;
  stopovers: AboardStopover[];
};
