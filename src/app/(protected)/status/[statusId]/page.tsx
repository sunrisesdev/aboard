import { IconArrowRight, IconTags } from '@tabler/icons-react';
import { clsx } from 'clsx';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Button } from '@/components/Button/Button';
import { FieldsetCard } from '@/components/FieldsetCard/FieldsetCard';
import { KeyValueTag } from '@/components/KeyValueTag/KeyValueTag';
import { PageContent } from '@/components/PageContent/PageContent';
import { getPolylineCoordinates } from '@/components/RouteMap/getPolylineCoordinates';
import { getRouteMapStop } from '@/components/RouteMap/getRouteMapStop';
import { RouteMap } from '@/components/RouteMap/RouteMap';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDate } from '@/helpers/formatDate';
import { formatDateTime } from '@/helpers/formatDateTime';
import { requireSession } from '@/lib/auth';
import {
  createTraewellingClient,
  getPolylines,
  getStatus,
  getStatusLikes,
  getStopovers,
  getTripStatuses,
  type StatusResource,
  TraewellingApiError,
} from '@/lib/traewelling';
import { getCheckinStopovers } from '@/status/getCheckinStopovers';
import { getNextStopover } from '@/status/getNextStopover';
import { getTransportColor } from '@/status/getTransportColor';
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

const getBusinessLabel = (business: number) =>
  businessOptions.find((option) => option.value === business)?.label ?? String(business);

const getVisibilityLabel = (visibility: number) =>
  visibilityOptions.find((option) => option.value === visibility)?.label ?? String(visibility);

// Mention positions and lengths count UTF-8 bytes (Träwelling uses PHP's preg_match_all), so the body is
// sliced as bytes. Each mention starts at an "@", so the slices never split a character.
const getBodyParts = (body: string, mentions: StatusResource['bodyMentions']) => {
  const bytes = new TextEncoder().encode(body);
  const decoder = new TextDecoder();
  const parts: { text: string; username?: string }[] = [];
  let offset = 0;

  for (const { length, position, user } of mentions.toSorted((a, b) => a.position - b.position)) {
    if (position < offset) continue;

    parts.push({ text: decoder.decode(bytes.subarray(offset, position)) });
    parts.push({
      text: decoder.decode(bytes.subarray(position, position + length)),
      username: typeof user?.username === 'string' ? user.username : undefined,
    });
    offset = position + length;
  }

  parts.push({ text: decoder.decode(bytes.subarray(offset)) });

  return parts.filter(({ text }) => text);
};

const parseStatusId = (statusId: string) => (/^\d+$/.test(statusId) ? Number(statusId) : notFound());

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

  return (
    <PageContent>
      <main className={styles.base}>
        <div className={styles.column}>
          <article className={clsx(body && styles.card)}>
            <header className={styles.header}>
              <Image alt="" className={styles.avatar} height={40} src={status.user.profilePicture} width={40} />
              <div>
                <div className={styles.author}>{status.user.displayName}</div>
                <div className={styles.username}>@{status.user.username}</div>
              </div>

              <span className={styles.pointsBadge}>+{status.checkin.points} Punkte</span>
            </header>

            {body && (
              <div className={styles.body}>
                {getBodyParts(body, status.bodyMentions).map(({ text, username }, index) =>
                  username ? (
                    <span key={index} style={{ cursor: 'pointer', fontWeight: '500' }} title={`@${username}`}>
                      {text}
                    </span>
                  ) : (
                    text
                  ),
                )}
              </div>
            )}

            <div className={styles.meta}>
              <time dateTime={status.createdAt}>{formatDateTime(status.createdAt)}</time>
              {status.client && ` · via ${status.client.name}`}
            </div>
          </article>

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
              color={getTransportColor(checkin) ?? 'var(--via-fg-primary)'}
              coordinates={routeCoordinates}
              deferred
              stops={routeMapStops}
            />
          </div>

          {checkin.dataSource && (
            <div className={styles.attribution}>{checkin.dataSource.attribution ?? checkin.dataSource.id}</div>
          )}
        </div>

        <div className={styles.column}>
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
              title={<FieldsetCard.Title>Mit in der Fahrt · {coTravelerStatuses.length}</FieldsetCard.Title>}
            >
              <ul className={styles.userList}>
                {coTravelerStatuses.map(({ checkin, id, user }) => (
                  <li className={styles.row} key={id}>
                    <Image alt="" className={styles.avatar} height={32} src={user.profilePicture} width={32} />
                    <div className={styles.userListText}>
                      <div className={styles.author}>{user.displayName}</div>
                      <div className={styles.segment}>
                        {cleanStationName(checkin.origin.station.name)} <IconArrowRight data-via-icon />{' '}
                        {cleanStationName(checkin.destination.station.name)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </FieldsetCard>
          )}

          {status.isLikable && (
            <article className={styles.card}>
              <div className={styles.row}>
                <Button variant={status.liked ? 'primary' : 'secondary'}>Gefällt mir</Button>
                {status.likes > 0 && <span style={{ fontWeight: 500 }}>{status.likes}</span>}
              </div>

              {likes.length > 0 && (
                <ul className={clsx(styles.userList, styles.likes)}>
                  {likes.map((user) => (
                    <li className={styles.row} key={user.id}>
                      <Image alt="" className={styles.avatar} height={24} src={user.profilePicture} width={24} />
                      <span>{user.displayName}</span>
                      <span>@{user.username}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          )}
        </div>

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
              {` · ${formatDate(status.event.begin)} – ${formatDate(status.event.end)}`}
            </dd>
          </dl>
        )}
      </main>
    </PageContent>
  );
}
