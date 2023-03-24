import StatusDetails from '@/components/StatusDetails/StatusDetails';
import { TraewellingSdk } from '@/traewelling-sdk';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StatusPageProps } from './types';

function getStatusData(id: string) {
  return TraewellingSdk.status.single({ id });
}

export async function generateMetadata({
  params,
}: StatusPageProps): Promise<Metadata> {
  const status = await getStatusData(params.id);

  return {
    title: `${status?.username}'s Reise nach ${status?.train.destination.name}  - aboard.at`,
  };
}

export default async function Page({ params }: StatusPageProps) {
  const status = await getStatusData(params.id);

  if (!status) notFound();

  return <StatusDetails status={status} />;
}
