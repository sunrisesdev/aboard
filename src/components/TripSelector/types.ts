import { HAFASProductType, HAFASTrip } from '@/traewelling-sdk/hafasTypes';

export type TripProps = {
  delay: number;
  departureAt: string | null;
  destination: string;
  lineName: string;
  onClick: () => void;
  plannedDepartureAt: string;
  product: HAFASProductType;
  productName: string;
  selectedStationName: string;
  stationName: string;
  tripNumber: string;
};

export type TripSelectorProps = {
  onTripSelect: (trip: HAFASTrip) => void;
  stationName: string;
};
