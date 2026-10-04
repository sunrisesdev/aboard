'use client';

import { IconBriefcase, IconBuilding, IconMessage, IconUser } from '@tabler/icons-react';
import { type ComponentProps, useState } from 'react';
import { Button } from '@/components/Button/Button';
import { CharacterCounter } from '@/components/CharacterCounter/CharacterCounter';
import { FieldsetCard } from '@/components/FieldsetCard/FieldsetCard';
import { SegmentedControl } from '@/components/SegmentedControl/SegmentedControl';
import type { Business } from '@/lib/traewelling';
import { CheckInFormProvider, useCheckInForm } from './CheckInForm.context';
import styles from './CheckInForm.module.css';

const bodyMaxLength = 280;

const Root = () => {
  const { error, formAction, formId } = useCheckInForm();
  const [body, setBody] = useState('');

  return (
    <form action={formAction} className={styles.base} id={formId}>
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
    </form>
  );
};

// Linked to the form via its id, so it can live outside of it.
export const CheckInFormSubmit = (props: ComponentProps<typeof Button>) => {
  const { formId, isPending } = useCheckInForm();

  return <Button disabled={isPending} form={formId} type="submit" {...props} />;
};

CheckInFormSubmit.displayName = 'CheckInForm.Submit';

export const CheckInForm = Object.assign(Root, {
  displayName: 'CheckInForm',
  Provider: CheckInFormProvider,
  Submit: CheckInFormSubmit,
});
