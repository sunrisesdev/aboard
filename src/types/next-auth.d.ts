import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
      image?: string | null;
      username: string;
      name: string;
      id: number;
    };
  }

  interface User {
    id: number;
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
    displayName: string;
    id: number;
  }
}
