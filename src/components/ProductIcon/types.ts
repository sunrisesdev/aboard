import { HAFASProductType } from '@/traewelling-sdk/hafasTypes';

export type ProductIconVariant = Extract<
  HAFASProductType,
  'bus' | 'suburban' | 'subway' | 'tram'
>;

export type ProductIconProps = {
  className?: string;
};
