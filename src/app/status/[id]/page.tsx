import StatusDetails from '@/components/StatusDetails/StatusDetails';
import { createLineAppearanceDataset } from '@/helpers/lineAppearance';
import { TraewellingSdk } from '@/traewelling-sdk';
import {
  transformTrwlStatus,
  transformTrwlTrip,
} from '@/traewelling-sdk/transformers';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StatusPageProps } from './types';

async function getStatusData(id: string) {
  const status = await TraewellingSdk.status.single({ id });

  if (!status) return null;

  const transformed = transformTrwlStatus(status);
  const { getAppearanceForLine } = await createLineAppearanceDataset();

  transformed.journey.line.appearance = getAppearanceForLine(
    transformed.journey.line
  );

  return transformed;
}

async function getTripData(
  hafasTripId: string,
  lineName: string,
  start: string
) {
  try {
    const trip = await TraewellingSdk.trains.trip({
      hafasTripId,
      lineName,
      start,
    });

    if (!('id' in trip)) {
      return trip;
    }

    return transformTrwlTrip(trip);
  } catch (error) {
    console.error(error);
    return { stopovers: [] };
  }
}

export async function generateMetadata({
  params,
}: StatusPageProps): Promise<Metadata> {
  const status = await getStatusData(params.id);

  return {
    title: `${status?.username} reist nach ${status?.journey.destination.station.name} - aboard.at`,
    description: `Nutze aboard.at um ${status?.username} auf seiner Reise nach ${status?.journey.destination.station.name} zu begleiten.`,
  };
}

export default async function Page({ params }: StatusPageProps) {
  const status = await getStatusData(params.id);

  if (!status) notFound();

  const tripData = await getTripData(
    status.journey.hafasTripId,
    status.journey.line.name,
    status.journey.origin.station.trwlId!.toString()
  );

  if ('trwlId' in tripData) {
    tripData.hafasId = status.journey.hafasTripId;
    tripData.line = status.journey.line;
  }

  const arrivingAt = new Date(
    status.journey.destination.arrival.planned!
  ).toISOString();
  const departuringAt = new Date(
    status.journey.origin.departure.planned!
  ).toISOString();

  const destinationIndex = tripData.stopovers?.findLastIndex(
    ({ arrival, station }) =>
      new Date(arrival.planned!).toISOString() === arrivingAt &&
      station.trwlId === status.journey.destination.station.trwlId
  );

  const originIndex = tripData.stopovers?.findIndex(
    ({ departure, station }) =>
      new Date(departure.planned!).toISOString() === departuringAt &&
      station.trwlId === status.journey.origin.station.trwlId
  );

  return (
    <StatusDetails
      destinationIndex={destinationIndex}
      originIndex={originIndex}
      status={status}
      stopovers={tripData.stopovers}
      trip={'trwlId' in tripData ? tripData : undefined}
    />
  );
}

export const revalidate = 60;
