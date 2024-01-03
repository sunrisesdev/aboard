import { HAFASProductType } from '@/traewelling-sdk/hafasTypes';
import { AboardMethod } from '@/types/aboard';
import { ReactNode } from 'react';
import ProductIcon from '../ProductIcon/ProductIcon';
import { ProductIconProps } from '../ProductIcon/types';

export const METHOD_ICONS: Record<
  AboardMethod,
  (props: ProductIconProps) => ReactNode
> = {
  bus: ProductIcon.Bus,
  ferry: ProductIcon.Ferry,
  national: ProductIcon.Other,
  'national-express': ProductIcon.Other,
  regional: ProductIcon.Other,
  'regional-express': ProductIcon.Other,
  suburban: ProductIcon.Suburban,
  subway: ProductIcon.Subway,
  taxi: ProductIcon.Other,
  tram: ProductIcon.Tram,
};

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
