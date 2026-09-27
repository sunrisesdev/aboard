import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { StationResource } from "@/lib/traewelling";
import { createTraewellingClient, searchStations } from "@/lib/traewelling";

function onlyDistinct(stations: StationResource[]) {
  const ids = new Set<number>();
  const names = new Set<string>();

  const distinctStations: StationResource[] = [];

  for (const station of stations) {
    if (ids.has(station.id) || names.has(station.name)) {
      continue;
    }

    ids.add(station.id);
    names.add(station.name);
    distinctStations.push(station);
  }

  return distinctStations;
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || session.error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const client = createTraewellingClient(session.accessToken as string);
  const stations = query ? await searchStations(client, { query }) : [];

  return NextResponse.json(onlyDistinct(stations));
}
