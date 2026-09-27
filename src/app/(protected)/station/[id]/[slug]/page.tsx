import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { formatTime } from "@/helpers/formatTime";
import { requireSession } from "@/lib/auth";
import {
  createTraewellingClient,
  getDepartures,
  TraewellingApiError,
} from "@/lib/traewelling";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { LineBadge } from "@/components/LineBadge/LineBadge";
import styles from "./StationBoard.module.css";

export default async function StationPage({
  params,
  searchParams,
}: PageProps<"/station/[id]/[slug]">) {
  const { id } = await params;
  const { at } = await searchParams;
  const session = await requireSession();

  return (
    <main>
      <Suspense fallback={<StationBoardSkeleton />}>
        <StationBoard
          accessToken={session.accessToken as string}
          id={id}
          at={at as string | undefined}
        />
      </Suspense>
    </main>
  );
}

async function StationBoard({
  accessToken,
  id,
  at,
}: {
  accessToken: string;
  id: string;
  at: string | undefined;
}) {
  const client = createTraewellingClient(accessToken);

  let result: Awaited<ReturnType<typeof getDepartures>>;
  try {
    result = await getDepartures(client, id, { when: at });
  } catch (error) {
    if (error instanceof TraewellingApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const { data: departures, meta } = result;

  return (
    <>
      <h1>{meta.station.name}</h1>
      <ul className={styles.list}>
        {departures.map((departure) => {
          const time = departure.when ?? departure.plannedWhen;
          const tripHref = `/trip/${encodeURIComponent(departure.tripId)}?${new URLSearchParams(
            {
              station: id,
              time: formatTime(time),
              line: departure.line.name ?? "",
            },
          ).toString()}`;
          return (
            <li key={departure.tripId}>
              <Link href={tripHref} className={styles.row}>
                <LineBadge
                  name={departure.line.name ?? ""}
                  color={departure.line.color}
                  textColor={departure.line.textColor}
                />
                <span className={styles.direction}>{departure.direction}</span>
                <time dateTime={time}>{formatTime(time)}</time>
                {departure.platform && <span>Gleis {departure.platform}</span>}
                {departure.cancelled && <span className={styles.cancelled}>Ausfall</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function StationBoardSkeleton() {
  return (
    <>
      <Skeleton width="12rem" height="1.5rem" />
      <ul>
        {Array.from({ length: 8 }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list, never reordered
          <li key={index}>
            <Skeleton width="100%" height="1.25rem" />
          </li>
        ))}
      </ul>
    </>
  );
}
