import NextAuth, { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  callbacks: {
    jwt: async ({ token, account, user }) => {
      if (user) {
        token.username = user.username;
        token.displayName = user.name;
        token.id = user.id as number;
      }

      token.accessToken = account?.access_token || token.accessToken;
      token.refreshToken = account?.refresh_token || token.refreshToken;

      return token;
    },
    session: async ({ session, token }) => {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;
      session.user.name = token.displayName;
      session.user.id = token.id;

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
        params: {
          scope: [
            'read-statuses',
            'read-notifications',
            'write-statuses',
            'write-likes',
            'write-notifications',
            'write-follows',
            'write-blocks',
            'read-settings',
            'read-settings-profile',
            'read-settings-followers',
            'write-followers',
          ].join(' '),
        },
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
  pages: {
    signIn: '/login',
  },
};

export default NextAuth(authOptions);
