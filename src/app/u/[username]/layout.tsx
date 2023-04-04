import { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}
