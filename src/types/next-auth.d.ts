import type { TraewellingUser } from "@/lib/traewelling/types";

declare module "next-auth" {
  interface User extends TraewellingUser {}

  interface Session {
    accessToken?: string;
    error?: "RefreshAccessTokenError";
    user: TraewellingUser;
  }
}
