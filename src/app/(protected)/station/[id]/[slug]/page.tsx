import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import {
  createTraewellingClient,
  getDepartures,
  TraewellingApiError,
} from "@/lib/traewelling";

export default async function StationPage({
  params,
  searchParams,
}: PageProps<"/station/[id]/[slug]">) {
  const { id } = await params;
  const { at } = await searchParams;
  const session = await requireSession();
  const client = createTraewellingClient(session.accessToken as string);

  let result: Awaited<ReturnType<typeof getDepartures>>;
  try {
    result = await getDepartures(client, id, {
      when: at as string | undefined,
    });
  } catch (error) {
    if (error instanceof TraewellingApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const { data: departures, meta } = result;

  return (
    <main>
      <h1>{meta.station.name}</h1>
      <ul>
        {departures.map((departure) => {
          const time = departure.when ?? departure.plannedWhen;
          return (
            <li key={departure.tripId}>
              <span>{departure.line.name}</span>
              <span>{departure.direction}</span>
              <time dateTime={time}>
                {new Date(time).toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
              {departure.platform && <span>Gleis {departure.platform}</span>}
              {departure.cancelled && <span>Ausfall</span>}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
