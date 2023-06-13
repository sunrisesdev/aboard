'use client';

import { LiveCheckInContext } from '@/contexts/LiveCheckIn/LiveCheckIn.context';
import { useContext } from 'react';
import styles from './LiveCheckInDetails.module.scss';
import LiveCheckInPart from './LiveCheckInPart';

const LiveCheckInDetails = () => {
  const { journey } = useContext(LiveCheckInContext);

  return (
    <main className={styles.base}>
      {journey.map((part, index) => (
        <LiveCheckInPart
          checkIn={part}
          hasSubsequentChangeover={index < journey.length - 1}
          key={`${index}-${part.trip.tripId}`}
        />
      ))}
    </main>
  );
};

export default LiveCheckInDetails;
