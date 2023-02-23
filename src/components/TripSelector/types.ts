import { HAFASProductType } from '@/traewelling-sdk/hafasTypes';

export type TripProps = {
  delay: number;
  departureAt: string | null;
  destination: string;
  lineName: string;
  plannedDepartureAt: string;
  product: HAFASProductType;
  productName: string;
  selectedStationName: string;
  stationName: string;
  tripNumber: string;
};

export type TripSelectorProps = {
  stationName: string;
};
