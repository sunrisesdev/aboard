import { HAFASTrip } from '@/traewelling-sdk/hafasTypes';
import { Station, Stop } from '@/traewelling-sdk/types';

export type CheckInDialogProps = {
  isOpen: boolean;
  onIsOpenChange: (value: boolean) => void;
};

export type CheckInSummaryProps = {
  selectedDeparture?: Pick<Station, 'name' | 'rilIdentifier'>;
  selectedDestination?: Stop;
  selectedTrip?: HAFASTrip;
};
