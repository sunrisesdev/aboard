import { HAFASTrip } from '@/traewelling-sdk/hafasTypes';
import { Station } from '@/traewelling-sdk/types';

export type CheckInDialogProps = {
  isOpen: boolean;
  onIsOpenChange: (value: boolean) => void;
};

export type CheckInSummaryProps = {
  selectedStation?: Pick<Station, 'name' | 'rilIdentifier'>;
  selectedTrip?: HAFASTrip;
};
