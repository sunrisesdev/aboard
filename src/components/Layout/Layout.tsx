'use client';

import { useIsDesktop } from '@/hooks/useIsDesktop/useIsDesktop';
import Image from 'next/image';
import { PropsWithChildren } from 'react';
import styles from './Layout.module.scss';
import Iphone from './iphone.png';

const Layout = ({ children }: PropsWithChildren) => {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.smartphone}>
          <iframe src="/" title="Aboard" className={styles.content} />
        </div>
        <Image src={Iphone} alt="Iphone" className={styles.image} />
      </div>
    );
  }

  return <>{children}</>;
};

export default Layout;
