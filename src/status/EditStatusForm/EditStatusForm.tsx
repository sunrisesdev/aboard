'use client';

import { IconClock, IconMapPin } from '@tabler/icons-react';
import { type ComponentProps, useId } from 'react';
import { Button } from '@/components/Button/Button';
import { FieldsetCard } from '@/components/FieldsetCard/FieldsetCard';
import { Input } from '@/components/Input/Input';
import { Select } from '@/components/Select/Select';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDateTime } from '@/helpers/formatDateTime';
import { StatusFields } from '@/status/StatusFields/StatusFields';
import { EditStatusFormProvider, getStopoverKey, useEditStatusForm } from './EditStatusForm.context';
import styles from './EditStatusForm.module.css';

const Root = ({ inDrawer = false }: { inDrawer?: boolean }) => {
  const { arrival, departure, destinationStopovers, error, formAction, formId, setFieldValue, setValue, values } =
    useEditStatusForm();
  const arrivalId = useId();
  const departureId = useId();
  const destinationId = useId();

  return (
    <form action={formAction} className={styles.base} id={formId}>
      <FieldsetCard
        icon={<IconMapPin data-via-icon />}
        title={<FieldsetCard.Title htmlFor={destinationId}>Ausstieg</FieldsetCard.Title>}
      >
        <Select
          className={styles.select}
          id={destinationId}
          onChange={(event) => setValue('destinationKey', event.target.value)}
          value={values.destinationKey}
        >
          {destinationStopovers.map((stopover) => {
            const time = stopover.arrivalPlanned ?? stopover.departurePlanned;

            return (
              <option key={getStopoverKey(stopover)} value={getStopoverKey(stopover)}>
                {cleanStationName(stopover.station.name)}
                {time && ` · ${formatDateTime(time, 'time')}`}
              </option>
            );
          })}
        </Select>
      </FieldsetCard>

      <FieldsetCard icon={<IconClock data-via-icon />} title={<FieldsetCard.Title>Zeiten</FieldsetCard.Title>}>
        <div className={styles.times}>
          <label className={styles.timeField} htmlFor={departureId}>
            Abfahrt
            <Input
              className={styles.timeInput}
              id={departureId}
              onChange={(event) => setValue('departure', event.target.value)}
              type="datetime-local"
              value={departure}
            />
          </label>

          <label className={styles.timeField} htmlFor={arrivalId}>
            Ankunft
            <Input
              className={styles.timeInput}
              id={arrivalId}
              onChange={(event) => setValue('arrival', event.target.value)}
              type="datetime-local"
              value={arrival}
            />
          </label>
        </div>
      </FieldsetCard>

      <StatusFields inDrawer={inDrawer} onValueChange={setFieldValue} values={values.fields} />

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export const EditStatusFormSubmit = (props: ComponentProps<typeof Button>) => {
  const { formId, isPending } = useEditStatusForm();

  return <Button disabled={isPending} form={formId} type="submit" {...props} />;
};

EditStatusFormSubmit.displayName = 'EditStatusForm.Submit';

export const EditStatusForm = Object.assign(Root, {
  displayName: 'EditStatusForm',
  Provider: EditStatusFormProvider,
  Submit: EditStatusFormSubmit,
});
