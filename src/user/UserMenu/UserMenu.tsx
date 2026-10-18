'use client';

import { Menu } from '@base-ui/react/menu';
import { IconChevronDown, IconLogout } from '@tabler/icons-react';
import { clsx } from 'clsx';
import Image from 'next/image';
import { useTransition } from 'react';
import type { Structure } from '@/helpers/extend';
import { signOutAction } from '@/user/actions';
import { useUser } from '@/user/useUser';
import styles from './UserMenu.module.css';

export const UserMenu = ({ className, ...props }: Structure) => {
  const { displayName, profilePicture, username } = useUser();
  const [isPending, startTransition] = useTransition();

  return (
    <Menu.Root>
      <Menu.Trigger aria-label="Benutzermenü" className={clsx(styles.trigger, className)} {...props}>
        <Image alt="" className={styles.avatar} height={32} src={profilePicture} width={32} />
        <IconChevronDown aria-hidden className={styles.chevron} data-via-icon />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner align="end" alignOffset={-4} className={styles.positioner} sideOffset={4}>
          <Menu.Popup className={styles.popup}>
            <div className={styles.user}>
              <div className={styles.displayName}>{displayName}</div>
              <div className={styles.username}>@{username}</div>
            </div>

            <Menu.Separator className={styles.separator} />

            <Menu.Item
              className={styles.item}
              disabled={isPending}
              onClick={() => startTransition(() => signOutAction())}
            >
              <IconLogout aria-hidden data-via-icon />
              Abmelden
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};
