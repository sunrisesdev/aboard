import StatusDetails from '@/components/StatusDetails/StatusDetails';
import { getStopsAfter } from '@/helpers/getStopsAfter';
import { TraewellingSdk } from '@/traewelling-sdk';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StatusPageProps } from './types';

function getStatusData(id: string) {
  return TraewellingSdk.status.single({ id });
}

function getStops(hafasTripId: string, lineName: string, start: string) {
  return TraewellingSdk.trains.trip({ hafasTripId, lineName, start });
}

export async function generateMetadata({
  params,
}: StatusPageProps): Promise<Metadata> {
  const status = await getStatusData(params.id);

  return {
    title: `${status?.username} reist nach ${status?.train.destination.name} - aboard.at`,
  };
}

export default async function Page({ params }: StatusPageProps) {
  const status = await getStatusData(params.id);

  if (!status) notFound();

  const { stopovers } = await getStops(
    status.train.hafasId,
    status.train.lineName,
    status.train.origin.id.toString()
  );

  const stops = getStopsAfter(
    status.train.origin.departurePlanned ?? '',
    status.train.origin.id.toString(),
    stopovers
  );

  return <StatusDetails status={status} stops={stops} />;
}
