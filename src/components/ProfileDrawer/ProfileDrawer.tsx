'use client';

import { motion } from 'framer-motion';
import { Fragment, PropsWithChildren, useRef, useState } from 'react';
import {
  TbDatabaseExport,
  TbHelp,
  TbLogout,
  TbSettings,
  TbUser,
} from 'react-icons/tb';
import Sheet, { SheetRef } from 'react-modal-sheet';
import styles from './ProfileDrawer.module.scss';
import type { ProfileDrawerProps } from './types';

import { signOut, useSession } from 'next-auth/react';

const SHEET_HEADER_HEIGHT = 40;

const ProfileDrawer = ({ children }: PropsWithChildren<ProfileDrawerProps>) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const ref = useRef<SheetRef>();
  const { data: session } = useSession();

  const handleOnSnap = (index: number) => {
    setExpanded(index === 0);
  };

  return (
    <Fragment>
      <div
        className={styles.base}
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        {children}
      </div>

      <Sheet
        detent="content-height"
        initialSnap={0}
        isOpen={isDrawerOpen}
        onClose={() => ref.current?.snapTo(2)}
        onSnap={handleOnSnap}
        snapPoints={[-16, 1 / 3, SHEET_HEADER_HEIGHT]}
        ref={ref}
      >
        <Sheet.Container className={styles.container}>
          <Sheet.Header />

          <Sheet.Content
            style={{ paddingBottom: ref.current?.y }}
            className={styles.content}
          >
            <h2 className={styles.headline}>Einstellungen</h2>

            <ul className={styles.links}>
              <li>
                <a
                  href={`https://traewelling.de/@${session?.user.username}`}
                  target="_blank"
                >
                  <TbUser />

                  <span>Profil</span>
                </a>
              </li>
              <li>
                <a href="https://traewelling.de/export" target="_blank">
                  <TbDatabaseExport />

                  <span>Fahrtenexport</span>
                </a>
              </li>
              <li>
                <a href="https://traewelling.de/about" target="_blank">
                  <TbHelp />
                  <div>Hilfe</div>
                </a>
              </li>
              <li>
                <a
                  href="https://traewelling.de/settings/profile"
                  target="_blank"
                >
                  <TbSettings />
                  <div>Einstellungen</div>
                </a>
              </li>
            </ul>

            <div className={styles.logout} onClick={() => signOut()}>
              <div>Abmelden</div> <TbLogout className={styles.icon} />
            </div>
          </Sheet.Content>
        </Sheet.Container>

        <Sheet.Backdrop
          className={styles.overlay}
          onTap={() => setIsDrawerOpen(false)}
        >
          <motion.div
            animate={{
              opacity: 1,
            }}
            style={{
              alignSelf: 'flex-start',
              backgroundImage:
                'linear-gradient(to bottom, #0000, var(--black-a9))',
              boxSizing: 'content-box',
              height: '100%',
              paddingBottom: '48px',
              width: '100%',
            }}
          />
        </Sheet.Backdrop>
      </Sheet>
    </Fragment>
  );
};

export default ProfileDrawer;
