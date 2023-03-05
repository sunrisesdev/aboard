import { HAFASProductType } from '@/traewelling-sdk/hafasTypes';
import { ReactNode } from 'react';
import ProductIcon from '../ProductIcon/ProductIcon';
import { ProductIconProps } from '../ProductIcon/types';

export const PRODUCT_ICONS: Record<
  HAFASProductType,
  (props: ProductIconProps) => ReactNode
> = {
  bus: ProductIcon.Bus,
  ferry: ProductIcon.Other,
  national: ProductIcon.Other,
  nationalExpress: ProductIcon.Other,
  regional: ProductIcon.Other,
  regionalExp: ProductIcon.Other,
  suburban: ProductIcon.Suburban,
  subway: ProductIcon.Subway,
  taxi: ProductIcon.Other,
  tram: ProductIcon.Tram,
};
