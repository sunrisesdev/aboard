import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageContent } from '@/components/PageContent/PageContent';
import { formatDateTime } from '@/helpers/formatDateTime';
import { isIsoDate } from '@/helpers/isIsoDate';
import { requireSession } from '@/lib/auth';
import { createTraewellingClient, getDailyStatistics, TraewellingApiError } from '@/lib/traewelling';
import statusesStyles from '@/status/Dashboard/Dashboard.module.css';
import { StatusSummary } from '@/status/StatusSummary/StatusSummary';

export async function generateMetadata({ params }: PageProps<'/statistics/daily/[date]'>): Promise<Metadata> {
  const { date } = await params;

  return { title: isIsoDate(date) ? `Fahrten am ${formatDateTime(date, 'date')}` : undefined };
}

export default async function DailyStatisticsPage({ params }: PageProps<'/statistics/daily/[date]'>) {
  const { date } = await params;
  if (!isIsoDate(date)) notFound();

  const session = await requireSession();
  const client = createTraewellingClient(session.accessToken as string);

  const { statuses = [] } = await getDailyStatistics(client, date).catch((error) => {
    if (error instanceof TraewellingApiError && error.status === 400) notFound();

    throw error;
  });

  return (
    <PageContent>
      <h1>Fahrten am {formatDateTime(date, 'date')}</h1>

      {statuses.length === 0 ? (
        <p>Keine Fahrten an diesem Tag.</p>
      ) : (
        <ul className={statusesStyles.statuses}>
          {statuses.map((status) => (
            <li key={status.id}>
              <StatusSummary status={status} />
            </li>
          ))}
        </ul>
      )}
    </PageContent>
  );
}
