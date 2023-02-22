import 'next-auth';

declare module 'next-auth' {
  interface Session {
    traewelling: {
      expiresAt: string;
      token: string;
    };
  }

  interface User {
    traewellingSession: {
      expiresAt: string;
      token: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    trwlExpiresAt: string;
    trwlToken: string;
  }
}
