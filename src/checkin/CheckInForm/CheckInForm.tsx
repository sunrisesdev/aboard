'use client';

import { IconBriefcase, IconBuilding, IconEye, IconMessage, IconUser } from '@tabler/icons-react';
import type { ComponentProps } from 'react';
import { CheckInVisibilityDrawer } from '@/checkin/CheckInVisibilityDrawer/CheckInVisibilityDrawer';
import { visibilityOptions } from '@/checkin/visibilityOptions';
import { Button } from '@/components/Button/Button';
import { CharacterCounter } from '@/components/CharacterCounter/CharacterCounter';
import { FieldsetCard } from '@/components/FieldsetCard/FieldsetCard';
import { RadioCards } from '@/components/RadioCards/RadioCards';
import { SegmentedControl } from '@/components/SegmentedControl/SegmentedControl';
import type { Business, StatusVisibility } from '@/lib/traewelling';
import { CheckInFormProvider, useCheckInForm } from './CheckInForm.context';
import styles from './CheckInForm.module.css';

const bodyMaxLength = 280;

const Root = ({ inDrawer = false }: { inDrawer?: boolean }) => {
  const { error, formAction, formId, setValue, values } = useCheckInForm();

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
          onChange={(event) => setValue('body', event.target.value)}
          placeholder="Was gibt's Neues?"
          value={values.body}
        />

        <CharacterCounter className={styles.characterCounter} count={values.body.length} limit={bodyMaxLength} />
      </FieldsetCard>

      <FieldsetCard
        icon={<IconBriefcase data-via-icon />}
        title={<FieldsetCard.Title id="label-business">Zweck der Fahrt</FieldsetCard.Title>}
      >
        <SegmentedControl<Business>
          aria-labelledby="label-business"
          onValueChange={(business) => setValue('business', business)}
          options={[
            { icon: <IconUser data-via-icon />, label: 'Privat', value: 0 },
            { icon: <IconBriefcase data-via-icon />, label: 'Geschäftlich', value: 1 },
            { icon: <IconBuilding data-via-icon />, label: 'Arbeitsweg', value: 2 },
          ]}
          value={values.business}
        />
      </FieldsetCard>

      <FieldsetCard
        icon={<IconEye data-via-icon />}
        title={<FieldsetCard.Title id="label-visibility">Sichtbarkeit</FieldsetCard.Title>}
      >
        {inDrawer ? (
          <CheckInVisibilityDrawer
            aria-labelledby="label-visibility"
            onValueChange={(visibility) => setValue('visibility', visibility)}
            value={values.visibility}
          />
        ) : (
          <RadioCards<StatusVisibility>
            aria-labelledby="label-visibility"
            columns={2}
            onValueChange={(visibility) => setValue('visibility', visibility)}
            options={visibilityOptions}
            value={values.visibility}
          />
        )}
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
