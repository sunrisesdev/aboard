import type { components } from "./schema";

export class TraewellingApiError<T = unknown> extends Error {
  readonly status: number;
  readonly body: T | undefined;

  constructor(status: number, body: T | undefined, fallbackMessage: string) {
    const message =
      body &&
      typeof body === "object" &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : fallbackMessage;
    super(message);
    this.name = "TraewellingApiError";
    this.status = status;
    this.body = body;
  }
}

export type CheckinForbiddenBody = {
  message: string;
  meta: {
    invalidUsers: number[];
  };
};

export type CheckinConflictBody = {
  message: {
    status_id: number | null;
    lineName: string | null;
  };
  data: {
    conflicts: components["schemas"]["StatusResource"][];
  };
};
