'use client';

import { AnimatePresence } from 'framer-motion';
import { Fragment, PropsWithChildren, useState } from 'react';
import styles from './ProfileDrawer.module.scss';
import type { ProfileDrawerProps } from './types';

const ProfileDrawer = ({ children }: PropsWithChildren<ProfileDrawerProps>) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Fragment>
      <div
        className={styles.base}
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        {children}
      </div>

      <AnimatePresence mode="wait">
        {isDrawerOpen && <div className={styles.drawer}>Hello world!</div>}
      </AnimatePresence>
    </Fragment>
  );
};

export default ProfileDrawer;
