import { TraewellingSdk } from '@/traewelling-sdk';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.trwlExpiresAt = user.traewellingSession.expiresAt;
        token.trwlToken = user.traewellingSession.token;
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.traewelling = {
        expiresAt: token.trwlExpiresAt,
        token: token.trwlToken,
      };

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'traewelling',
      name: 'Traewelling',
      credentials: {
        login: { label: 'Benutzername', type: 'text' },
        password: { label: 'Passwort', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }

        const data = await TraewellingSdk.auth.login(credentials);
        const user = await TraewellingSdk.auth.user(`Bearer ${data.token}`);

        return {
          id: user.username,
          image: user.profilePicture,
          name: user.displayName,
          traewellingSession: data,
        };
      },
    }),
  ],
  session: {
    maxAge: 365 * 24 * 60 * 60,
  },
});
