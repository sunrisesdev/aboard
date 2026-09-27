import type { TraewellingClient } from "./client";
import type { components, operations } from "./schema";

type TripResource = components["schemas"]["TripResource"];

export async function getTripInfo(
  client: TraewellingClient,
  query: operations["getTrainTrip"]["parameters"]["query"],
) {
  const { data } = await client
    .get("v1/trains/trip", { searchParams: query })
    .json<{ data: TripResource }>();

  return data;
}
