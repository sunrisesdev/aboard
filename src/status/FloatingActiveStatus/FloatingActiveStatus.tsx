'use client';

import { clsx } from 'clsx';
import { use } from 'react';
import { ActiveStatus } from '@/status/ActiveStatus/ActiveStatus';
import { useCurrentStatuses } from '@/status/useCurrentStatuses';
import styles from './FloatingActiveStatus.module.css';

// Meant as the last element of <main>: sticks to the bottom of the viewport while scrolling, but lands in the flow at the
// end of the page instead of covering its last content
export const FloatingActiveStatus = ({ className }: { className?: string }) => {
  const { active } = use(useCurrentStatuses().currentStatusesPromise);

  if (!active) return null;

  return (
    <div className={clsx(styles.base, className)}>
      <ActiveStatus />
    </div>
  );
};
