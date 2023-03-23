import { PropsWithChildren } from 'react';

export default async function RootLayout({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}
