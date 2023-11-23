import { Figtree, Inter, Radio_Canada, Source_Sans_3 } from 'next/font/google';

export const figtree = Figtree({ subsets: ['latin'] });
export const inter = Inter({ subsets: ['latin'] });
export const radioCanada = Radio_Canada({
  subsets: ['latin'],
  weight: 'variable',
});
export const sourceSans3 = Source_Sans_3({
  fallback: ['system-ui'],
  subsets: ['latin'],
  weight: 'variable',
});
