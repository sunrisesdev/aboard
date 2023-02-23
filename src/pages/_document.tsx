import { sourceSans3 } from '@/styles/fonts';
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={sourceSans3.className}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
