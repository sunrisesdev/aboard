import ky, { isHTTPError } from "ky";
import { TraewellingApiError } from "./errors";

export function createTraewellingClient(accessToken: string) {
  console.log(accessToken);

  return ky.create({
    baseUrl: "https://traewelling.de/api/",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    hooks: {
      beforeError: [
        ({ error }) => {
          if (isHTTPError(error)) {
            return new TraewellingApiError(
              error.response.status,
              error.data,
              error.message,
            );
          }

          return error;
        },
      ],
    },
  });
}

export type TraewellingClient = ReturnType<typeof createTraewellingClient>;
