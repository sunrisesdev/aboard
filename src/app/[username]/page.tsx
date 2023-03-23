import { TraewellingSdk } from '@/traewelling-sdk';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

async function getUserProfileData(username: string) {
  const userData = await TraewellingSdk.user.get(username);

  return userData;
}

async function getUserStatuses(username: string) {
  const statuses = await TraewellingSdk.user.getStatuses(username);

  return statuses;
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const userData = await getUserProfileData(params.username);

  return { title: `${userData?.displayName} - aboard.at` };
}

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const userData = await getUserProfileData(params.username);
  const statuses = await getUserStatuses(params.username);

  if (userData === null) notFound();

  return (
    <div>
      <h1>User</h1>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
      <h1>Statuses</h1>
      <pre>{JSON.stringify(statuses, null, 2)}</pre>
    </div>
  );
}
