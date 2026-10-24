'use client';

import { IconClock, IconMapPin, IconRestore } from '@tabler/icons-react';
import { type ComponentProps, useId } from 'react';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { FieldsetCard } from '@/components/FieldsetCard/FieldsetCard';
import { Input } from '@/components/Input/Input';
import { Select } from '@/components/Select/Select';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDateTime } from '@/helpers/formatDateTime';
import { StatusFields } from '@/status/StatusFields/StatusFields';
import { EditStatusFormProvider, getStopoverKey, useEditStatusForm } from './EditStatusForm.context';
import styles from './EditStatusForm.module.css';

const Root = ({ inDrawer = false }: { inDrawer?: boolean }) => {
  const {
    arrival,
    canResetArrival,
    canResetDeparture,
    departure,
    destinationStopovers,
    error,
    formAction,
    formId,
    setFieldValue,
    setValue,
    values,
  } = useEditStatusForm();
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
          <div className={styles.timeField}>
            <label htmlFor={departureId}>Abfahrt</label>
            <ButtonGroup>
              <Input
                id={departureId}
                onChange={(event) => setValue('departure', event.target.value)}
                type="datetime-local"
                value={departure}
              />
              <Button
                aria-label="Abfahrt zurücksetzen"
                disabled={!canResetDeparture}
                iconOnly
                onClick={() => setValue('departure', null)}
                style={{ flex: 'none' }}
                variant="secondary"
              >
                <IconRestore aria-hidden data-via-icon />
              </Button>
            </ButtonGroup>
          </div>

          <div className={styles.timeField}>
            <label htmlFor={arrivalId}>Ankunft</label>
            <ButtonGroup>
              <Input
                id={arrivalId}
                onChange={(event) => setValue('arrival', event.target.value)}
                type="datetime-local"
                value={arrival}
              />
              <Button
                aria-label="Ankunft zurücksetzen"
                disabled={!canResetArrival}
                iconOnly
                onClick={() => setValue('arrival', null)}
                style={{ flex: 'none' }}
                variant="secondary"
              >
                <IconRestore aria-hidden data-via-icon />
              </Button>
            </ButtonGroup>
          </div>
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
