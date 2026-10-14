import type { PropsWithChildren } from 'react';
import { Navbar } from '@/components/Navbar/Navbar';
import { getDebugTimeOffset } from '@/debug/debugTime';
import { requireSession } from '@/lib/auth';
import { createTraewellingClient } from '@/lib/traewelling';
import { CurrentStatusesProvider } from '@/status/CurrentStatuses.context';
import { loadCurrentStatuses } from '@/status/loadCurrentStatuses';
import { UserContextProvider } from '@/user/User.context';

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const { accessToken, user } = await requireSession();

  // Not awaited, so pages don't wait for it. A failure only hides the current statuses instead of breaking the page.
  const client = createTraewellingClient(accessToken as string);
  const timeOffset = await getDebugTimeOffset();
  const currentStatusesPromise = loadCurrentStatuses(client, user.username, timeOffset).catch((error) => {
    console.error('Loading the current statuses failed', error);

    return {};
  });

  return (
    <UserContextProvider user={user}>
      <CurrentStatusesProvider currentStatusesPromise={currentStatusesPromise}>
        <Navbar />

        <main>{children}</main>
      </CurrentStatusesProvider>
    </UserContextProvider>
  );
}
