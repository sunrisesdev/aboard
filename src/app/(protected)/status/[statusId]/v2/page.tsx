import { IconArrowRight, IconHeartHandshake, IconLocationShare, IconTags, IconUsers } from '@tabler/icons-react';
import { clsx } from 'clsx';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { type CSSProperties, cache } from 'react';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import { KeyValueTag } from '@/components/KeyValueTag/KeyValueTag';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { Marquee } from '@/components/Marquee/Marquee';
import { PageContent } from '@/components/PageContent/PageContent';
import { getPolylineCoordinates } from '@/components/RouteMap/getPolylineCoordinates';
import { getRouteMapStop } from '@/components/RouteMap/getRouteMapStop';
import { RouteMap } from '@/components/RouteMap/RouteMap';
import { getSubtleTintedPalette } from '@/components/TintedSurface/getSubtleTintedPalette';
import { tintedSurfaceFallbackColor } from '@/components/TintedSurface/TintedSurface';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDateTime } from '@/helpers/dateTime';
import { getStationHref, getUserHref } from '@/helpers/hrefs';
import { getLineColors } from '@/helpers/lineColors';
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
import { getCheckinColor } from '@/status/getCheckinColor';
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
import styles from '../Status.module.css';
import v2Styles from './StatusV2.module.css';

// Experimental second layout of the status page, see ../page.tsx for the current one

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

// E.g. "Fabians" or "Klaus’": names ending in an s-sound only get an apostrophe
function formatGenitive(name: string) {
  return /(s|ß|x|z|ce)$/i.test(name) ? `${name}’` : `${name}s`;
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

export async function generateMetadata({ params }: PageProps<'/status/[statusId]/v2'>): Promise<Metadata> {
  const statusId = parseStatusId((await params).statusId);
  const session = await requireSession();
  const status = await loadStatus(session.accessToken as string, statusId);

  return {
    title: `${formatGenitive(status.user.displayName)} Fahrt nach ${cleanStationName(status.checkin.destination.station.name)}`,
  };
}

export default async function StatusPageV2({ params }: PageProps<'/status/[statusId]/v2'>) {
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

  const { arrival } = getCheckinTimes(checkin);
  const lineColor = getLineColors({ color: checkin.routeColor, mode: getCheckinMode(checkin) }).background;

  const routeMapStops = [getRouteMapStop(checkin.origin), getRouteMapStop(checkin.destination)];
  // Falls back to a straight line when Träwelling has no polyline for this status
  const routeCoordinates =
    polylines
      .map((polyline) => getPolylineCoordinates(polyline))
      .find((coordinates) => coordinates && coordinates.length >= 2)
    ?? routeMapStops.map(({ coordinates }) => coordinates);

  return (
    <>
      <section
        className={v2Styles.hero}
        style={
          {
            '--via-status-hero-overlay-color': getSubtleTintedPalette(lineColor ?? tintedSurfaceFallbackColor).gradient
              .from,
          } as CSSProperties
        }
      >
        <RouteMap
          className={v2Styles.map}
          deferred
          routes={[{ color: lineColor ?? 'var(--via-fg-primary)', coordinates: routeCoordinates }]}
          stops={routeMapStops}
        />

        <div className={v2Styles.heroContent}>
          <div className={v2Styles.heroTitle}>
            <LineBadge
              backgroundColor={checkin.routeColor ?? undefined}
              className={v2Styles.lineBadge}
              color={checkin.routeTextColor ?? undefined}
              journeyNumber={checkin.manualJourneyNumber ?? String(checkin.journeyNumber)}
              mode={getCheckinMode(checkin)}
              name={checkin.lineName}
              productName={undefined}
            />

            {checkinStopovers?.direction && (
              <div className={v2Styles.direction}>
                <span className={v2Styles.directionLabel}>Richtung</span>
                <Marquee className={v2Styles.directionStation}>
                  {cleanStationName(checkinStopovers.direction.station.name)}
                </Marquee>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className={v2Styles.tripRow}>
        <div className={v2Styles.tripRowContent}>
          <div className={v2Styles.trip}>
            <StatusTrip
              checkin={checkin}
              direction={checkinStopovers?.direction}
              nextStopover={nextStopover}
              now={now}
              stopovers={checkinStopovers?.stopovers}
            />

            <ButtonGroup>
              <Button leadingSlot={<IconHeartHandshake aria-hidden data-via-icon />} variant="secondary">
                <span>Fahrt beitreten</span>
              </Button>

              <ButtonLink
                href={getStationHref(checkin.destination.station, arrival)}
                leadingSlot={<IconLocationShare aria-hidden data-via-icon />}
                variant="secondary"
              >
                <span>Weiterfahrt planen</span>
              </ButtonLink>
            </ButtonGroup>

            {checkin.dataSource && <div className={styles.attribution}>{checkin.dataSource.attribution}</div>}
          </div>

          <article className={v2Styles.status}>
            <div>
              <header className={styles.header}>
                <Image alt="" className={styles.avatar} height={40} src={status.user.profilePicture} width={40} />
                <Link href={getUserHref(status.user.username)}>
                  <div className={styles.author}>{status.user.displayName}</div>
                  <div className={styles.username}>@{status.user.username}</div>
                </Link>

                <span className={styles.pointsBadge}>+{status.checkin.points} Punkte</span>

                {status.user.uuid === session.user.uuid && (
                  <StatusActionsMenu
                    destinationStopovers={getDestinationStopovers(tripStopovers, checkin)}
                    status={status}
                  />
                )}
              </header>

              <div className={styles.meta}>
                <time dateTime={status.createdAt}>{formatDateTime(status.createdAt)}</time>
                {status.client && ` · via ${status.client.name}`}
              </div>
            </div>

            {body && (
              <blockquote className={v2Styles.message}>
                <span aria-hidden className={v2Styles.quote} style={{ color: getCheckinColor(checkin) }}>
                  “
                </span>
                <StatusBody body={body} mentions={status.bodyMentions} paragraphs />
              </blockquote>
            )}

            <div className={v2Styles.details}>
              <section>
                <h2 className={v2Styles.sectionTitle}>
                  <IconTags aria-hidden data-via-icon />
                  Tags
                </h2>

                <div className={styles.tags}>
                  {checkin.operator && <KeyValueTag keySlot="Betreiber" valueSlot={checkin.operator.name} />}
                  {(checkin.manualJourneyNumber ?? checkin.journeyNumber) && (
                    <KeyValueTag
                      keySlot="Fahrtnummer"
                      valueSlot={checkin.manualJourneyNumber ?? checkin.journeyNumber}
                    />
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
              </section>

              {(coTravelerStatuses.length > 0 || status.isLikable) && (
                <div className={v2Styles.detailsColumn}>
                  {coTravelerStatuses.length > 0 && (
                    <section>
                      <h2 className={v2Styles.sectionTitle}>
                        <IconUsers aria-hidden data-via-icon />
                        Mit in der Fahrt
                      </h2>

                      <ul className={styles.userList}>
                        {coTravelerStatuses.map(({ checkin, id, user }) => (
                          <li key={id}>
                            <Link className={styles.row} href={`/status/${id}/v2`}>
                              <Image
                                alt=""
                                className={styles.avatar}
                                height={32}
                                src={user.profilePicture}
                                width={32}
                              />
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
                    </section>
                  )}

                  {status.isLikable && (
                    <div>
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
                                    <Image
                                      alt=""
                                      className={styles.avatar}
                                      height={24}
                                      src={user.profilePicture}
                                      width={24}
                                    />
                                    <span>{user.displayName}</span>
                                    <span className={styles.username}>@{user.username}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </details>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </article>
        </div>
      </div>

      <PageContent>
        {status.createdBy && (
          <p>
            Eingecheckt von {status.createdBy.displayName} (@{status.createdBy.username})
          </p>
        )}

        {status.hide_body && <p>Dein Statustext wurde von der Moderation für andere ausgeblendet.</p>}
        {status.moderation_notes && <p>Hinweis der Moderation: {status.moderation_notes}</p>}

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
    </>
  );
}
