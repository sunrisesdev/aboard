import type { TraewellingClient } from "./client";
import type { components } from "./schema";

type CheckinRequestBody = components["schemas"]["CheckinRequestBody"];
type CheckinSuccessResource = components["schemas"]["CheckinSuccessResource"];

export async function createCheckin(
  client: TraewellingClient,
  body: CheckinRequestBody,
) {
  // Wrapped in `data` like the other endpoints, although the OpenAPI spec omits it here
  const { data } = await client
    .post("v1/trains/checkin", { json: body })
    .json<{ data: CheckinSuccessResource }>();
  return data;
}
