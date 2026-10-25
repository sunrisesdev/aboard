import {
  IconChartAreaLineFilled,
  IconClockHour4Filled,
  IconNavigationFilled,
  IconStarsFilled,
  IconUserCheck,
  IconUserPlus,
} from '@tabler/icons-react';
import { clsx } from 'clsx';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';
import { Button } from '@/components/Button/Button';
import { PageContent } from '@/components/PageContent/PageContent';
import { SubtleTintedSurface } from '@/components/TintedSurface/SubtleTintedSurface';
import { formatDistance } from '@/helpers/formatDistance';
import { formatMinutes } from '@/helpers/formatMinutes';
import { requireSession } from '@/lib/auth';
import {
  createTraewellingClient,
  getUser,
  getUserStatuses,
  TraewellingApiError,
  type TraewellingClient,
} from '@/lib/traewelling';
import { ProfileLink } from '@/profile/ProfileLink/ProfileLink';
import statusesStyles from '@/status/Dashboard/Dashboard.module.css';
import { StatusSummary } from '@/status/StatusSummary/StatusSummary';
import { StatusSummarySkeleton } from '@/status/StatusSummarySkeleton/StatusSummarySkeleton';
import freiburg from './freiburg.avif';
import styles from './Profile.module.css';

// Cached, so generateMetadata and the page share a single request
const loadUser = cache(async (accessToken: string, username: string) => {
  try {
    return await getUser(createTraewellingClient(accessToken), username);
  } catch (error) {
    if (error instanceof TraewellingApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
});

const UserStatuses = async ({ client, username }: { client: TraewellingClient; username: string }) => {
  try {
    const statuses = await getUserStatuses(client, username);

    if (statuses.length === 0) {
      return <p className={styles.hint}>Noch keine Check-ins.</p>;
    }

    return (
      <ul className={statusesStyles.statuses}>
        {statuses.map((status) => (
          <li key={status.id}>
            <StatusSummary status={status} />
          </li>
        ))}
      </ul>
    );
  } catch (error) {
    if (error instanceof TraewellingApiError && error.status === 403) {
      return <p className={styles.hint}>Dieses Profil ist privat.</p>;
    }

    throw error;
  }
};

const UserStatusesSkeleton = () => {
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

export async function generateMetadata({ params }: PageProps<'/user/[username]'>): Promise<Metadata> {
  const { username } = await params;
  const session = await requireSession();
  const user = await loadUser(session.accessToken as string, decodeURIComponent(username));

  return { title: `Profil von ${user.displayName}` };
}

export default async function ProfilePage({ params }: PageProps<'/user/[username]'>) {
  const username = decodeURIComponent((await params).username);
  const session = await requireSession();
  const accessToken = session.accessToken as string;
  const user = await loadUser(accessToken, username);

  const profileLinks = [
    ...(user.mastodonUrl ? [{ name: 'mastodon', url: user.mastodonUrl }] : []),
    ...user.profileLinks,
  ] as typeof user.profileLinks;

  return (
    <PageContent
      aside={
        <>
          <div className={styles.card}>
            <div className={styles.header}>
              <Image alt="" className={styles.headerImage} src={freiburg} unoptimized />
            </div>

            <div className={styles.body}>
              <Image alt="" className={styles.avatar} height={92} src={user.profilePicture} width={96} />

              <div className={styles.actions}>
                {user.uuid !== session.user.uuid && (
                  <Button
                    leadingSlot={
                      user.following ? (
                        <IconUserCheck aria-hidden data-via-icon />
                      ) : (
                        <IconUserPlus aria-hidden data-via-icon />
                      )
                    }
                    variant={user.following ? 'secondary' : 'primary'}
                  >
                    {user.following ? 'Du folgst' : 'Folgen'}
                  </Button>
                )}
              </div>

              <div className={styles.content}>
                <div style={{ marginTop: '0.5rem' }}>
                  <h1 className={styles.displayName}>{user.displayName}</h1>
                  <div className={styles.username}>@{user.username}</div>
                </div>

                {user.bio && (
                  <div className={styles.bio}>
                    {user.bio
                      .replaceAll(/\n+/g, '\n')
                      .split('\n')
                      .map((paragraph, index) => (
                        <p key={index}> {paragraph}</p>
                      ))}
                  </div>
                )}

                {user.followedBy && <div className={styles.follows}>Folgt dir</div>}

                {profileLinks.length > 0 && (
                  <div className={styles.profileLinks}>
                    {profileLinks.map(({ name: type, url }) => (
                      <ProfileLink key={url} type={type} url={url} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className={styles.cardDivider} />

          <div className={styles.card}>
            <div className={styles.title}>
              <IconChartAreaLineFilled aria-hidden data-via-icon />
              Statistiken
            </div>

            <div
              style={{ alignItems: 'stretch', display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(2, 1fr)' }}
            >
              <SubtleTintedSurface
                className={clsx(styles.statsSurface, styles.isPrimary)}
                color="#008754"
                radius="0.75rem"
              >
                <SubtleTintedSurface.Content className={styles.content}>
                  <div className={styles.value}>{formatDistance(user.totalDistance)}</div>
                  <em>circa {(user.totalDistance / 40_075_000).toFixed(1)}&times; um die Erde</em>
                </SubtleTintedSurface.Content>
                <IconNavigationFilled className={styles.signet} data-via-icon />
              </SubtleTintedSurface>

              <SubtleTintedSurface
                className={clsx(styles.statsSurface, !user.pointsEnabled && styles.isPrimary)}
                color="#992572"
                radius="0.75rem"
              >
                <SubtleTintedSurface.Content className={styles.content}>
                  <div className={styles.value}>
                    {user.totalDuration.toLocaleString('de-DE', { style: 'unit', unit: 'minute' })}
                  </div>
                  <em>{formatMinutes(user.totalDuration, { abbreviate: false })}</em>
                  <IconClockHour4Filled className={styles.signet} data-via-icon />
                </SubtleTintedSurface.Content>
              </SubtleTintedSurface>

              {user.pointsEnabled && (
                <SubtleTintedSurface className={styles.statsSurface} color="#EFAF00" radius="0.75rem">
                  <SubtleTintedSurface.Content className={styles.content}>
                    <div className={styles.value}>{user.points} Punkte</div>
                    <IconStarsFilled className={styles.signet} data-via-icon />
                  </SubtleTintedSurface.Content>
                </SubtleTintedSurface>
              )}
            </div>
          </div>
        </>
      }
      asidePosition="start"
    >
      {user.userInvisibleToMe ? (
        <p className={styles.hint}>Dieses Profil ist privat.</p>
      ) : (
        <Suspense fallback={<UserStatusesSkeleton />}>
          <UserStatuses client={createTraewellingClient(accessToken)} username={user.username} />
        </Suspense>
      )}
    </PageContent>
  );
}
