'use client';

import type { ComponentProps } from 'react';
import { Button } from '@/components/Button/Button';
import { StatusFields } from '@/status/StatusFields/StatusFields';
import { CheckInFormProvider, useCheckInForm } from './CheckInForm.context';
import styles from './CheckInForm.module.css';

const Root = ({ inDrawer = false }: { inDrawer?: boolean }) => {
  const { error, formAction, formId, setValue, values } = useCheckInForm();

  return (
    <form action={formAction} className={styles.base} id={formId}>
      <StatusFields inDrawer={inDrawer} onValueChange={setValue} values={values} />

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
