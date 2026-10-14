'use client';

import { type FormEvent, use } from 'react';
import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { resetDebugTimeAction, setDebugTimeAction } from '@/debug/actions';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDateTime } from '@/helpers/formatDateTime';
import type { StatusResource } from '@/lib/traewelling';
import { getCheckinTimes } from '@/status/getCheckinTimes';
import { useCurrentStatuses } from '@/status/useCurrentStatuses';
import styles from './DebugTimePanel.module.css';

// Development only: simulates the time relative to a status, e.g. 5 minutes before its departure or arrival
export const DebugTimePanel = ({ statuses }: { statuses: StatusResource[] }) => {
  const { currentStatusesPromise, refresh } = useCurrentStatuses();
  const { timeOffset } = use(currentStatusesPromise);

  // Not a form action, since React would reset the fields after each submit
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const status = statuses.find(({ id }) => String(id) === formData.get('status'));
    const anchor = formData.get('anchor') === 'arrival' ? 'arrival' : 'departure';
    const time = status && getCheckinTimes(status.checkin)[anchor];

    if (!time) return;

    await setDebugTimeAction(new Date(Date.parse(time) - Number(formData.get('minutes')) * 60_000).toISOString());
    refresh();
  };

  const handleReset = async () => {
    await resetDebugTimeAction();
    refresh();
  };

  return (
    <Card className={styles.base}>
      <strong>Debug: Zeit simulieren</strong>

      <form className={styles.form} onSubmit={handleSubmit}>
        <select className={styles.status} defaultValue={statuses[0]?.id} name="status">
          {statuses.map(({ checkin, id }) => {
            const { departure } = getCheckinTimes(checkin);

            return (
              <option key={id} value={id}>
                {departure && `${formatDateTime(departure)} · `}
                {checkin.lineName}: {cleanStationName(checkin.origin.station.name)} →{' '}
                {cleanStationName(checkin.destination.station.name)}
              </option>
            );
          })}
        </select>

        <select defaultValue="departure" name="anchor">
          <option value="departure">Fahrt beginnt in</option>
          <option value="arrival">Fahrt endet in</option>
        </select>

        <label className={styles.minutes}>
          <input defaultValue={5} name="minutes" step={1} type="number" /> min
        </label>

        <Button type="submit">Anwenden</Button>
        {!!timeOffset && (
          <Button type="button" variant="secondary" onClick={handleReset}>
            Zurücksetzen
          </Button>
        )}
      </form>

      <span className={styles.state}>
        {timeOffset ? `Simuliert: ${formatDateTime(new Date(Date.now() + timeOffset).toISOString())}` : 'Echte Zeit'}
      </span>
    </Card>
  );
};
