import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createTraewellingClient, getDepartures, type TravelType } from "@/lib/traewelling";

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/station/[stationId]/departures">,
) {
  const session = await auth();
  if (!session || session.error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { stationId } = await params;
  const when = request.nextUrl.searchParams.get("when") ?? undefined;
  const travelType = (request.nextUrl.searchParams.get("travelType") ?? undefined) as TravelType | undefined;
  const client = createTraewellingClient(session.accessToken as string);
  const result = await getDepartures(client, stationId, { when, travelType });

  return NextResponse.json(result);
}
