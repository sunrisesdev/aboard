import { HAFASProductType } from '@/traewelling-sdk/hafasTypes';

export type LineIndicatorProps = {
  className?: string;
  isInverted?: boolean;
  lineId: string;
  lineName: string;
  product: HAFASProductType;
};
