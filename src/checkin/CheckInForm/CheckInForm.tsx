'use client';

import { IconBriefcase, IconBuilding, IconMessage, IconUser } from '@tabler/icons-react';
import { useActionState, useState } from 'react';
import { submitCheckinAction } from '@/checkin/actions';
import { useCheckIn } from '@/checkin/useCheckIn';
import { Button } from '@/components/Button/Button';
import { CharacterCounter } from '@/components/CharacterCounter/CharacterCounter';
import { FieldsetCard } from '@/components/FieldsetCard/FieldsetCard';
import { SegmentedControl } from '@/components/SegmentedControl/SegmentedControl';
import type { Business } from '@/lib/traewelling';
import styles from './CheckInForm.module.css';

const bodyMaxLength = 280;

export const CheckInForm = () => {
  const {
    dispatch,
    state: { departure, destination },
    trip: { boardingStopover },
  } = useCheckIn();
  const [body, setBody] = useState('');

  const [error, formAction, isPending] = useActionState(
    async (_previousError: string | undefined, formData: FormData) => {
      const arrival = destination?.arrivalPlanned ?? destination?.departurePlanned;

      if (!departure || !boardingStopover || !destination || !arrival) {
        return 'Die Fahrt konnte nicht zugeordnet werden.';
      }

      const result = await submitCheckinAction({
        arrival,
        body: (formData.get('body') as string | null) || null,
        business: Number(formData.get('business')) as Business,
        departure: boardingStopover.departurePlanned ?? departure.plannedWhen,
        destination: destination.station.id,
        lineName: departure.line.name ?? '',
        start: boardingStopover.station.id,
        tripId: departure.tripId,
      });

      if (!result.success) {
        return result.message;
      }

      dispatch({ type: 'reset' });
    },
    undefined,
  );

  return (
    <form action={formAction} className={styles.base}>
      <FieldsetCard
        icon={<IconMessage data-via-icon />}
        optional
        title={<FieldsetCard.Title htmlFor="input-body">Statusnachricht</FieldsetCard.Title>}
      >
        <textarea
          className={styles.textarea}
          id="input-body"
          maxLength={bodyMaxLength}
          name="body"
          onChange={(event) => setBody(event.target.value)}
          placeholder="Was gibt's Neues?"
          value={body}
        />

        <CharacterCounter className={styles.characterCounter} count={body.length} limit={bodyMaxLength} />
      </FieldsetCard>

      <FieldsetCard
        icon={<IconBriefcase data-via-icon />}
        title={<FieldsetCard.Title id="label-business">Zweck der Fahrt</FieldsetCard.Title>}
      >
        <SegmentedControl<Business>
          aria-labelledby="label-business"
          defaultValue={0}
          name="business"
          options={[
            { icon: <IconUser data-via-icon />, label: 'Privat', value: 0 },
            { icon: <IconBriefcase data-via-icon />, label: 'Geschäftlich', value: 1 },
            { icon: <IconBuilding data-via-icon />, label: 'Arbeitsweg', value: 2 },
          ]}
        />
      </FieldsetCard>

      {error && <p className={styles.error}>{error}</p>}

      <Button disabled={isPending} type="submit">
        Einchecken
      </Button>
    </form>
  );
};
