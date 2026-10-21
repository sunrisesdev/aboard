'use client';

import { IconArrowRight, IconCircleCheck, IconLocationShare } from '@tabler/icons-react';
import { clsx } from 'clsx';
import type { CompletedCheckIn } from '@/checkin/types';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import { cleanStationName } from '@/helpers/cleanStationName';
import { getStationHref } from '@/helpers/getStationHref';
import { getCheckinTimes } from '@/status/getCheckinTimes';
import styles from './CheckInSuccess.module.css';

const Root = ({ completedCheckIn: { points, status } }: { completedCheckIn: CompletedCheckIn }) => (
  <div className={styles.base}>
    <IconCircleCheck aria-hidden className={styles.icon} />
    <p className={styles.message}>Gute Fahrt nach {cleanStationName(status.checkin.destination.station.name)}!</p>
    <p className={styles.points}>+{points} Punkte</p>
  </div>
);

export const CheckInSuccessActions = ({
  completedCheckIn: { status },
  stretch = false,
}: {
  completedCheckIn: CompletedCheckIn;
  // Lets the actions share the available width, e.g. in a drawer footer
  stretch?: boolean;
}) => (
  <>
    <ButtonLink
      className={clsx(stretch && styles.stretch)}
      href={getStationHref(status.checkin.destination.station, getCheckinTimes(status.checkin).arrival)}
      variant="secondary"
    >
      <IconLocationShare aria-hidden data-via-icon />
      <span>Weiterfahrt planen</span>
    </ButtonLink>

    <ButtonLink className={clsx(stretch && styles.stretch)} href={`/status/${status.id}`}>
      <span>Zum Status</span>
      <IconArrowRight aria-hidden data-via-icon />
    </ButtonLink>
  </>
);

CheckInSuccessActions.displayName = 'CheckInSuccess.Actions';

export const CheckInSuccess = Object.assign(Root, {
  Actions: CheckInSuccessActions,
  displayName: 'CheckInSuccess',
});
