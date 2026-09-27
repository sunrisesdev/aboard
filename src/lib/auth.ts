import NextAuth from "next-auth";
import { redirect } from "next/navigation";
import type { Provider } from "next-auth/providers";
import type { components } from "@/lib/traewelling/schema";
import type { TraewellingUser } from "@/lib/traewelling/types";

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

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [traewelling],
  callbacks: {
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      if (user) {
        Object.assign(token, user);
      }
      return token;
    },
    session({ session, token }) {
      const { accessToken, refreshToken, ...user } = token as typeof token &
        TraewellingUser & { accessToken?: string; refreshToken?: string };
      session.accessToken = accessToken;
      session.user = user as unknown as typeof session.user;
      return session;
    },
  },
});

// The middleware guard already redirects unauthenticated requests away from
// protected pages, but Server Components still need a non-nullable session to
// read from (e.g. a token that got invalidated between the middleware and the
// page render).
export async function requireSession() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return session;
}
