import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createTraewellingClient, getDepartures } from "@/lib/traewelling";

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/station/[id]/departures">,
) {
  const session = await auth();
  if (!session || session.error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const when = request.nextUrl.searchParams.get("when") ?? undefined;
  const client = createTraewellingClient(session.accessToken as string);
  const result = await getDepartures(client, id, { when });

  return NextResponse.json(result);
}
