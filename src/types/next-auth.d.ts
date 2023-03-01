import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
    };
  }

  interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    image: string;
    privateProfile: boolean;
    preventIndex: boolean;
    language: string;
    defaultStatusVisibility: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    username: string;
  }
}
