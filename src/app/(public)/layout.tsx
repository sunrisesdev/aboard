import type { PropsWithChildren } from 'react';

export default function PublicLayout({ children }: PropsWithChildren) {
  return <main>{children}</main>;
}
