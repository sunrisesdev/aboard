'use client';

import { Button } from '@/components/Button/Button';
import { toDatetimeLocalValue } from '@/helpers/toDatetimeLocalValue';
import { useStationboard } from '@/station/Stationboard/useStationboard';
import styles from './StationboardTimePicker.module.css';

export const StationboardTimePicker = () => {
  const { changeRequestedTime, requestedTime } = useStationboard();

  return (
    <>
      <input
        type="datetime-local"
        className={styles.picker}
        value={toDatetimeLocalValue(requestedTime ?? new Date().toISOString())}
        onChange={(event) =>
          changeRequestedTime(event.target.value ? new Date(event.target.value).toISOString() : undefined)
        }
      />
      <Button onClick={() => changeRequestedTime(undefined)}>Jetzt</Button>
    </>
  );
};
