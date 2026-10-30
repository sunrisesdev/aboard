import { IconArrowRight, IconHeartHandshake, IconLocationShare, IconTags, IconUsers } from '@tabler/icons-react';
import { clsx } from 'clsx';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import { Card } from '@/components/Card/Card';
import { FieldsetCard } from '@/components/FieldsetCard/FieldsetCard';
import { KeyValueTag } from '@/components/KeyValueTag/KeyValueTag';
import { PageContent } from '@/components/PageContent/PageContent';
import { getPolylineCoordinates } from '@/components/RouteMap/getPolylineCoordinates';
import { getRouteMapStop } from '@/components/RouteMap/getRouteMapStop';
import { RouteMap } from '@/components/RouteMap/RouteMap';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDateTime } from '@/helpers/formatDateTime';
import { getLineColors } from '@/helpers/getLineColors';
import { getStationHref } from '@/helpers/getStationHref';
import { getUserHref } from '@/helpers/getUserHref';
import { requireSession } from '@/lib/auth';
import {
  createTraewellingClient,
  getPolylines,
  getStatus,
  getStatusLikes,
  getStopovers,
  getTripStatuses,
  type StatusLike,
  TraewellingApiError,
} from '@/lib/traewelling';
import { getCheckinMode } from '@/status/getCheckinMode';
import { getCheckinStopovers } from '@/status/getCheckinStopovers';
import { getCheckinTimes } from '@/status/getCheckinTimes';
import { getDestinationStopovers } from '@/status/getDestinationStopovers';
import { getNextStopover } from '@/status/getNextStopover';
import { StatusActionsMenu } from '@/status/StatusActionsMenu/StatusActionsMenu';
import { StatusBody } from '@/status/StatusBody/StatusBody';
import { StatusLikeButton } from '@/status/StatusLikeButton/StatusLikeButton';
import { StatusTrip } from '@/status/StatusTrip/StatusTrip';
import { businessOptions, visibilityOptions } from '@/status/statusOptions';
import styles from './Status.module.css';

const tagKeyLabels: Record<string, string> = {
  'trwl:journey_number': 'Fahrtnummer',
  'trwl:locomotive_class': 'Baureihe',
  'trwl:passenger_rights': 'Fahrgastrechte',
  'trwl:price': 'Preis',
  'trwl:role': 'Rolle',
  'trwl:seat': 'Sitzplatz',
  'trwl:social_status': 'Ansprechbarkeit',
  'trwl:ticket': 'Fahrkarte',
  'trwl:travel_class': 'Klasse',
  'trwl:vehicle_number': 'Fahrzeugnummer',
  'trwl:wagon': 'Wagen',
  'trwl:wagon_class': 'Wagengattung',
};

const socialStatusLabels: Record<string, string> = {
  do_not_disturb: 'Bitte nicht stören',
  open: 'Offen für Gespräche',
  open_find_me: 'Komm gern vorbei',
  open_lets_hang: 'Lass uns abhängen',
};

function getBusinessLabel(business: number) {
  return businessOptions.find((option) => option.value === business)?.label ?? String(business);
}

function getVisibilityLabel(visibility: number) {
  return visibilityOptions.find((option) => option.value === visibility)?.label ?? String(visibility);
}

const likeListFormat = new Intl.ListFormat('de-DE', { type: 'conjunction' });

// E.g. "Dir, Jonas Weber, Mira K. und 10 weiteren gefällt das", the current user's like always comes first
function getLikeSummary(likes: StatusLike[], username: string) {
  const ownLike = likes.find((like) => like.username === username);
  const otherLikes = likes.filter((like) => like !== ownLike);
  const names = otherLikes.slice(0, 2).map(({ displayName }) => displayName);
  const overflow = otherLikes.length - names.length;

  const parts = [
    ownLike && 'Dir',
    ...names,
    overflow === 1 && 'einer weiteren Person',
    overflow > 1 && `${overflow} weiteren`,
  ].filter((part): part is string => !!part);

  return {
    avatarLikes: (ownLike ? [ownLike, ...otherLikes] : otherLikes).slice(0, 5),
    text: `${likeListFormat.format(parts)} gefällt dieser Status.`,
  };
}

function parseStatusId(statusId: string) {
  return /^\d+$/.test(statusId) ? Number(statusId) : notFound();
}

// Cached, so generateMetadata and the page share a single request
const loadStatus = cache(async (accessToken: string, statusId: number) => {
  try {
    return await getStatus(createTraewellingClient(accessToken), statusId);
  } catch (error) {
    // A status the user isn't allowed to see is treated as nonexistent
    if (error instanceof TraewellingApiError && (error.status === 403 || error.status === 404)) {
      notFound();
    }

    throw error;
  }
});

export async function generateMetadata({ params }: PageProps<'/status/[statusId]'>): Promise<Metadata> {
  const statusId = parseStatusId((await params).statusId);
  const session = await requireSession();
  const status = await loadStatus(session.accessToken as string, statusId);

  return { title: `Status von ${status.user.displayName}` };
}

export default async function StatusPage({ params }: PageProps<'/status/[statusId]'>) {
  const statusId = parseStatusId((await params).statusId);
  const session = await requireSession();
  const accessToken = session.accessToken as string;

  const client = createTraewellingClient(accessToken);
  const statusPromise = loadStatus(accessToken, statusId);

  // Awaited before rendering, so a missing status results in an actual 404 response. The map, the
  // stopovers, the likes and the co-travelers are optional.
  const [status, polylines, tripStopovers, likes, tripStatuses] = await Promise.all([
    statusPromise,
    getPolylines(client, [statusId]).catch(() => []),
    statusPromise.then(({ checkin }) =>
      getStopovers(client, [checkin.trip])
        .then((stopoversByTrip) => stopoversByTrip[checkin.trip])
        .catch(() => undefined),
    ),
    getStatusLikes(client, statusId).catch(() => []),
    statusPromise.then(({ checkin }) => getTripStatuses(client, checkin.trip).catch(() => [])),
  ]);

  const { checkin } = status;
  const body = typeof status.body === 'string' ? status.body : undefined;
  const coTravelerStatuses = tripStatuses.filter(({ id }) => id !== status.id);
  const likeSummary = getLikeSummary(likes, session.user.username);

  const now = new Date();
  const checkinStopovers = tripStopovers && getCheckinStopovers(tripStopovers, checkin);
  const nextStopover = checkinStopovers && getNextStopover(checkinStopovers.stopovers, checkin, now);

  const routeMapStops = [getRouteMapStop(checkin.origin), getRouteMapStop(checkin.destination)];
  // Falls back to a straight line when Träwelling has no polyline for this status
  const routeCoordinates =
    polylines
      .map((polyline) => getPolylineCoordinates(polyline))
      .find((coordinates) => coordinates && coordinates.length >= 2)
    ?? routeMapStops.map(({ coordinates }) => coordinates);

  const statusContent = (
    <>
      <header className={styles.header}>
        <Image alt="" className={styles.avatar} height={40} src={status.user.profilePicture} width={40} />
        <Link href={getUserHref(status.user.username)}>
          <div className={styles.author}>{status.user.displayName}</div>
          <div className={styles.username}>@{status.user.username}</div>
        </Link>

        <span className={styles.pointsBadge}>+{status.checkin.points} Punkte</span>

        {status.user.uuid === session.user.uuid && (
          <StatusActionsMenu destinationStopovers={getDestinationStopovers(tripStopovers, checkin)} status={status} />
        )}
      </header>

      {body && <StatusBody body={body} className={styles.body} mentions={status.bodyMentions} />}

      <div className={styles.meta}>
        <time dateTime={status.createdAt}>{formatDateTime(status.createdAt)}</time>
        {status.client && ` · via ${status.client.name}`}
      </div>
    </>
  );

  return (
    <PageContent
      aside={
        <>
          <ButtonGroup>
            <Button leadingSlot={<IconHeartHandshake aria-hidden data-via-icon />} variant="secondary">
              <span>Fahrt beitreten</span>
            </Button>

            <ButtonLink
              href={getStationHref(checkin.destination.station, getCheckinTimes(checkin).arrival)}
              leadingSlot={<IconLocationShare aria-hidden data-via-icon />}
              variant="secondary"
            >
              <span>Weiterfahrt planen</span>
            </ButtonLink>
          </ButtonGroup>

          <FieldsetCard icon={<IconTags data-via-icon />} title={<FieldsetCard.Title>Tags</FieldsetCard.Title>}>
            <div className={styles.tags}>
              {checkin.operator && <KeyValueTag keySlot="Betreiber" valueSlot={checkin.operator.name} />}
              {(checkin.manualJourneyNumber ?? checkin.journeyNumber) && (
                <KeyValueTag keySlot="Fahrtnummer" valueSlot={checkin.manualJourneyNumber ?? checkin.journeyNumber} />
              )}
              <KeyValueTag keySlot="Zweck" valueSlot={getBusinessLabel(status.business)} />
              <KeyValueTag keySlot="Sichtbarkeit" valueSlot={getVisibilityLabel(status.visibility)} />
              {status.tags.map((tag) => (
                <KeyValueTag
                  key={tag.key}
                  keySlot={tagKeyLabels[tag.key] ?? tag.key}
                  valueSlot={(tag.key === 'trwl:social_status' && socialStatusLabels[tag.value]) || tag.value}
                />
              ))}
            </div>
          </FieldsetCard>

          {coTravelerStatuses.length > 0 && (
            <FieldsetCard
              icon={<IconUsers data-via-icon />}
              title={<FieldsetCard.Title>Mit in der Fahrt</FieldsetCard.Title>}
            >
              <ul className={styles.userList}>
                {coTravelerStatuses.map(({ checkin, id, user }) => (
                  <li key={id}>
                    <Link className={styles.row} href={`/status/${id}`}>
                      <Image alt="" className={styles.avatar} height={32} src={user.profilePicture} width={32} />
                      <div className={styles.userListText}>
                        <div className={styles.author}>{user.displayName}</div>
                        <div className={styles.segment}>
                          {cleanStationName(checkin.origin.station.name)} <IconArrowRight data-via-icon />{' '}
                          {cleanStationName(checkin.destination.station.name)}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </FieldsetCard>
          )}

          {status.isLikable && (
            <Card>
              <div className={styles.row}>
                <StatusLikeButton showLabel status={status} />
              </div>

              {likes.length > 0 && (
                <>
                  <div className={styles.likeSummary}>
                    <div className={styles.avatarStack}>
                      {likeSummary.avatarLikes.map((user) => (
                        <Image
                          alt=""
                          className={styles.avatar}
                          height={32}
                          key={user.id}
                          src={user.profilePicture}
                          width={32}
                        />
                      ))}
                    </div>

                    <span className={styles.likeSummaryText}>{likeSummary.text}</span>
                  </div>

                  <details className={styles.likeDetails}>
                    <summary className={styles.likeDetailsToggle}>
                      <span className={styles.showLabel}>Alle {likes.length} anzeigen</span>
                      <span className={styles.hideLabel}>Weniger anzeigen</span>
                    </summary>

                    <ul className={clsx(styles.userList, styles.likes)}>
                      {likes.map((user) => (
                        <li key={user.id}>
                          <Link className={styles.row} href={getUserHref(user.username)}>
                            <Image alt="" className={styles.avatar} height={24} src={user.profilePicture} width={24} />
                            <span>{user.displayName}</span>
                            <span className={styles.username}>@{user.username}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </>
              )}
            </Card>
          )}
        </>
      }
    >
      <article>{body ? <Card>{statusContent}</Card> : statusContent}</article>

      {status.createdBy && (
        <p>
          Eingecheckt von {status.createdBy.displayName} (@{status.createdBy.username})
        </p>
      )}

      {status.hide_body && <p>Dein Statustext wurde von der Moderation für andere ausgeblendet.</p>}
      {status.moderation_notes && <p>Hinweis der Moderation: {status.moderation_notes}</p>}

      <StatusTrip
        checkin={checkin}
        direction={checkinStopovers?.direction}
        nextStopover={nextStopover}
        now={now}
        stopovers={checkinStopovers?.stopovers}
      />

      <div className={styles.mapCard}>
        <RouteMap
          className={styles.map}
          deferred
          routes={[
            {
              color:
                getLineColors({ color: checkin.routeColor, mode: getCheckinMode(checkin) }).background
                ?? 'var(--via-fg-primary)',
              coordinates: routeCoordinates,
            },
          ]}
          stops={routeMapStops}
        />
      </div>

      {checkin.dataSource && <div className={styles.attribution}>{checkin.dataSource.attribution}</div>}

      {status.event && (
        <dl>
          <dt>Veranstaltung</dt>
          <dd>
            {status.event.url ? (
              <a href={status.event.url} rel="noreferrer" target="_blank">
                {status.event.name}
              </a>
            ) : (
              status.event.name
            )}
            {status.event.hashtag && ` #${status.event.hashtag}`}
            {status.event.host && ` · ${status.event.host}`}
            {status.event.station && ` · ${cleanStationName(status.event.station.name)}`}
            {` · ${formatDateTime(status.event.begin, 'date')} – ${formatDateTime(status.event.end, 'date')}`}
          </dd>
        </dl>
      )}
    </PageContent>
  );
}
