import { redirect } from "next/navigation";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import type { components } from "@/lib/traewelling/schema";
import type { TraewellingUser } from "@/lib/traewelling/types";

type TraewellingToken = TraewellingUser & {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: number;
  error?: "RefreshAccessTokenError";
};

const traewelling: Provider = {
  id: "traewelling",
  name: "Träwelling",
  type: "oauth",
  authorization: {
    url: "https://traewelling.de/oauth/authorize",
    params: {
      scope:
        "read-statuses read-notifications write-statuses write-likes write-notifications write-follows write-blocks read-settings read-settings-profile read-settings-followers write-followers",
    },
  },
  token: "https://traewelling.de/oauth/token",
  userinfo: "https://traewelling.de/api/v1/auth/user",
  clientId: process.env.TRAEWELLING_CLIENT_ID,
  clientSecret: process.env.TRAEWELLING_CLIENT_SECRET,
  profile(profile: { data: components["schemas"]["UserAuthResource"] }) {
    return { ...profile.data, id: String(profile.data.id) };
  },
};

// Laravel Passport redeems refresh tokens at the same `/oauth/token` endpoint
// used for the initial exchange (grant_type=refresh_token), not a dedicated
// refresh route.
async function refreshAccessToken(
  token: TraewellingToken,
): Promise<TraewellingToken> {
  if (!token.refreshToken) {
    return { ...token, error: "RefreshAccessTokenError" };
  }

  try {
    const response = await fetch("https://traewelling.de/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
        client_id: process.env.TRAEWELLING_CLIENT_ID as string,
        client_secret: process.env.TRAEWELLING_CLIENT_SECRET as string,
      }),
    });

    if (!response.ok) {
      throw new Error(`Refresh failed with status ${response.status}`);
    }

    const refreshed: {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    } = await response.json();

    return {
      ...token,
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      accessTokenExpiresAt: Date.now() + refreshed.expires_in * 1000,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [traewelling],
  callbacks: {
    async jwt({ token, account, user }) {
      let current = token as TraewellingToken;

      if (account) {
        current = {
          ...current,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpiresAt: account.expires_at
            ? account.expires_at * 1000
            : undefined,
        };
      }
      if (user) {
        Object.assign(current, user);
      }

      // A missing expiry (e.g. a session predating this field) is treated as
      // expired rather than valid, so it self-heals on the next request
      // instead of silently keeping a dead access token forever.
      const isExpired =
        !current.accessTokenExpiresAt ||
        Date.now() >= current.accessTokenExpiresAt;
      if (!isExpired) {
        return current;
      }

      return refreshAccessToken(current);
    },
    session({ session, token }) {
      const {
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        error,
        ...user
      } = token as typeof token & TraewellingToken;
      session.accessToken = accessToken;
      session.error = error;
      session.user = user as unknown as typeof session.user;
      return session;
    },
  },
});

// The middleware guard already redirects unauthenticated requests away from
// protected pages, but Server Components still need a non-nullable session to
// read from (e.g. a token that got invalidated, or whose refresh failed,
// between the middleware and the page render).
export async function requireSession() {
  const session = await auth();
  if (!session || session.error) {
    redirect("/");
  }
  return session;
}
