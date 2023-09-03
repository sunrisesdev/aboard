import { Figtree, Inter, Source_Sans_3 } from 'next/font/google';

export const figtree = Figtree({ subsets: ['latin'] });
export const inter = Inter({ subsets: ['latin'] });
export const sourceSans3 = Source_Sans_3({
  fallback: ['system-ui'],
  subsets: ['latin'],
});
