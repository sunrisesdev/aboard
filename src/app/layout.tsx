import { Fira_Sans_Condensed, Inter, Radio_Canada } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';

const firaSansCondensed = Fira_Sans_Condensed({ weight: ['400', '500', '600', '700'], variable: '--via-sans' });
const inter = Inter({ weight: ['600'], variable: '--via-line' });
const radioCanada = Radio_Canada({ weight: ['400', '500'], variable: '--via-time' });

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="de">
      <body className={clsx(firaSansCondensed.variable, inter.variable, radioCanada.variable)}>
        <div style={{ isolation: 'isolate' }}>{children}</div>
      </body>
    </html>
  );
}
