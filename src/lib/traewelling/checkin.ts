import type { TraewellingClient } from "./client";
import type { components } from "./schema";

type CheckinRequestBody = components["schemas"]["CheckinRequestBody"];
type CheckinSuccessResource = components["schemas"]["CheckinSuccessResource"];

export async function createCheckin(
  client: TraewellingClient,
  body: CheckinRequestBody,
) {
  return client
    .post("v1/trains/checkin", { json: body })
    .json<CheckinSuccessResource>();
}
