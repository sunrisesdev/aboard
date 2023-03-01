import NextAuth from 'next-auth';

export default NextAuth({
  callbacks: {
    jwt: async ({ token, account, profile, user }) => {
      if (user) {
        token.username = user.username;
      }

      token.accessToken = account?.access_token || token.accessToken;
      token.refreshToken = account?.refresh_token || token.refreshToken;

      return token;
    },
    session: async ({ session, token }) => {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      return session;
    },
  },
  providers: [
    {
      id: 'traewelling',
      name: 'Träwelling',
      version: '2.0',
      type: 'oauth',
      authorization: {
        url: 'https://traewelling.de/oauth/authorize',
        params: { scope: '' },
      },
      userinfo: 'https://traewelling.de/api/v1/auth/user',
      profileUrl: 'https://traewelling.de/api/v1/auth/user',
      token: 'https://traewelling.de/oauth/token',
      clientId: process.env.TRAEWELLING_CLIENT_ID,
      clientSecret: process.env.TRAEWELLING_CLIENT_SECRET,
      profile({ data: profile }) {
        return {
          id: profile.id,
          name: profile.displayName,
          username: profile.username,
          email: profile.email,
          image: profile.profilePicture,
          mastodonUrl: profile.mastodonUrl,
          privateProfile: profile.privateProfile,
          preventIndex: profile.preventIndex,
          language: profile.language,
          defaultStatusVisibility: profile.defaultStatusVisibility,
        };
      },
    },
  ],
  session: {
    maxAge: 365 * 24 * 60 * 60,
  },
});
