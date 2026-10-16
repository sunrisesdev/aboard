import { Suspense } from 'react';
import { NavbarAttachment } from '@/components/NavbarAttachment/NavbarAttachment';
import { PageContent } from '@/components/PageContent/PageContent';
import { DebugTimePanel } from '@/debug/DebugTimePanel/DebugTimePanel';
import { isDebugTimeEnabled } from '@/debug/debugTime';
import { requireSession } from '@/lib/auth';
import { createTraewellingClient, getDashboard, getUserStatuses } from '@/lib/traewelling';
import { StationSearchDrawer } from '@/station/StationSearchDrawer/StationSearchDrawer';
import { ActiveStatus } from '@/status/ActiveStatus/ActiveStatus';
import { Dashboard } from '@/status/Dashboard/Dashboard';
import statusesStyles from '@/status/Dashboard/Dashboard.module.css';
import { FloatingActiveStatus } from '@/status/FloatingActiveStatus/FloatingActiveStatus';
import { StatusSummarySkeleton } from '@/status/StatusSummarySkeleton/StatusSummarySkeleton';
import styles from './Dashboard.module.css';

type DashboardPromise = ReturnType<typeof getDashboard>;

const DashboardLoader = async ({ dashboardPromise }: { dashboardPromise: DashboardPromise }) => {
  const { data: statuses, nextPage } = await dashboardPromise;

  return <Dashboard initialNextPage={nextPage} initialStatuses={statuses} />;
};

const DebugTimePanelLoader = async ({ accessToken, username }: { accessToken: string; username: string }) => {
  const statuses = await getUserStatuses(createTraewellingClient(accessToken), username);

  return <DebugTimePanel statuses={statuses} />;
};

const DashboardSkeleton = () => {
  return (
    <ul className={statusesStyles.statuses}>
      {Array.from({ length: 3 }, (_, index) => (
        <li key={index}>
          <StatusSummarySkeleton />
        </li>
      ))}
    </ul>
  );
};

export default async function DashboardPage() {
  const session = await requireSession();

  // Not awaited: the statuses stream in, while the rest of the page is usable right away.
  const dashboardPromise = getDashboard(createTraewellingClient(session.accessToken as string));

  return (
    <>
      <NavbarAttachment className={styles.stationSearch}>
        <StationSearchDrawer triggerClassName={styles.stationSearchTrigger} />
      </NavbarAttachment>

      <PageContent
        aside={
          <>
            <Suspense fallback={null}>
              <ActiveStatus className={styles.asideStatus} />
            </Suspense>
          </>
        }
      >
        <h1>Hallo, {session.user.displayName}</h1>

        {isDebugTimeEnabled && (
          <Suspense fallback={null}>
            <DebugTimePanelLoader accessToken={session.accessToken as string} username={session.user.username} />
          </Suspense>
        )}

        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardLoader dashboardPromise={dashboardPromise} />
        </Suspense>
      </PageContent>

      <Suspense fallback={null}>
        <FloatingActiveStatus className={styles.floatingStatus} />
      </Suspense>
    </>
  );
}
