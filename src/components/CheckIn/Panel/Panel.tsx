import { LiveCheckInContext } from '@/contexts/LiveCheckIn/LiveCheckIn.context';
import clsx from 'clsx';
import { useContext } from 'react';
import { CheckInContext } from '../CheckIn.context';
import styles from './Panel.module.scss';
import { PanelProps } from './types';

const Panel = ({ children }: PanelProps) => {
  const { currentStatus, isOpen } = useContext(CheckInContext);
  const { journey } = useContext(LiveCheckInContext);

  return (
    <div
      className={clsx(
        styles.base,
        isOpen && styles.isOpen,
        !!currentStatus && journey.length === 0 && styles.hasCurrentStatus,
        journey.length > 0 && styles.hasLiveCheckIn
      )}
    >
      {children}
    </div>
  );
};

export default Panel;
