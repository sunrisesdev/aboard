import type { PropsWithChildren } from 'react';
import { Navbar } from '@/components/Navbar/Navbar';
import { requireSession } from '@/lib/auth';
import { createTraewellingClient, getUserStatuses } from '@/lib/traewelling';
import { CurrentStatusesProvider } from '@/status/CurrentStatuses.context';
import { getCurrentStatuses } from '@/status/getCurrentStatuses';
import { UserContextProvider } from '@/user/User.context';

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const { accessToken, user } = await requireSession();

  // Not awaited, so pages don't wait for it. A failure only hides the current statuses instead of breaking the page.
  const currentStatusesPromise = getUserStatuses(createTraewellingClient(accessToken as string), user.username)
    .then((statuses) => getCurrentStatuses(statuses, new Date()))
    .catch((error) => {
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
