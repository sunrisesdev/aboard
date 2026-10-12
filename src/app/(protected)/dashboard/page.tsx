import { Suspense } from 'react';
import { PageContent } from '@/components/PageContent/PageContent';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { requireSession, signOut } from '@/lib/auth';
import { createTraewellingClient, getDashboard } from '@/lib/traewelling';
import { StationSearchDrawer } from '@/station/StationSearchDrawer/StationSearchDrawer';
import { Dashboard } from '@/status/Dashboard/Dashboard';

type DashboardPromise = ReturnType<typeof getDashboard>;

const DashboardLoader = async ({ dashboardPromise }: { dashboardPromise: DashboardPromise }) => {
  const { data: statuses, nextPage } = await dashboardPromise;

  return <Dashboard initialNextPage={nextPage} initialStatuses={statuses} />;
};

const DashboardSkeleton = () => {
  return (
    <div>
      {Array.from({ length: 5 }, (_, index) => (
        <article key={index}>
          <p>
            <Skeleton width="8rem" height="1.25rem" />
          </p>
          <p>
            <Skeleton width="4rem" height="1.25rem" />
          </p>
          <p>
            <Skeleton width="16rem" height="1.25rem" />
          </p>
        </article>
      ))}
    </div>
  );
};

export default async function DashboardPage() {
  const session = await requireSession();

  // Not awaited: the statuses stream in, while the rest of the page is usable right away.
  const dashboardPromise = getDashboard(createTraewellingClient(session.accessToken as string));

  return (
    <PageContent aside={<div>Favoriten</div>}>
      <h1>Hallo, {session.user.displayName}</h1>
      <p>@{session.user.username}</p>
      <StationSearchDrawer />
      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: '/' });
        }}
      >
        <button type="submit">Abmelden</button>
      </form>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLoader dashboardPromise={dashboardPromise} />
      </Suspense>
    </PageContent>
  );
}
