'use client';

import { createContext, type PropsWithChildren, use, useActionState, useId, useState } from 'react';
import { toDatetimeLocalValue } from '@/helpers/toDatetimeLocalValue';
import type { StatusResource, StatusUpdateBody, StopoverResource } from '@/lib/traewelling';
import { updateStatusAction } from '@/status/actions';
import { getCheckinTimes } from '@/status/getCheckinTimes';
import { isSameStopover } from '@/status/isSameStopover';
import type { StatusFieldValues } from '@/status/StatusFields/StatusFields';

// Times are datetime-local values, undefined while the user hasn't touched them and null once reset to live data
type EditStatusFormValues = {
  arrival: string | null | undefined;
  departure: string | null | undefined;
  destinationKey: string;
  fields: StatusFieldValues;
};

type EditStatusFormContextValue = {
  arrival: string;
  canResetArrival: boolean;
  canResetDeparture: boolean;
  departure: string;
  destinationStopovers: StopoverResource[];
  error: string | undefined;
  formAction: () => void;
  formId: string;
  isPending: boolean;
  setFieldValue: <Key extends keyof StatusFieldValues>(key: Key, value: StatusFieldValues[Key]) => void;
  setValue: <Key extends keyof EditStatusFormValues>(key: Key, value: EditStatusFormValues[Key]) => void;
  values: EditStatusFormValues;
};

const EditStatusFormContext = createContext<EditStatusFormContextValue | undefined>(undefined);

export function getStopoverKey(stopover: StopoverResource) {
  return stopover.uuid ?? String(stopover.stopoverId);
}

function toIsoString(datetimeLocalValue: string | null) {
  return datetimeLocalValue ? new Date(datetimeLocalValue).toISOString() : null;
}

// Mount it inside the popup so the values reset whenever the popup closes.
export const EditStatusFormProvider = ({
  children,
  destinationStopovers,
  onSuccess,
  status,
}: PropsWithChildren<{ destinationStopovers: StopoverResource[]; onSuccess: () => void; status: StatusResource }>) => {
  const { checkin } = status;
  const formId = useId();
  const [values, setValues] = useState<EditStatusFormValues>(() => ({
    arrival: undefined,
    departure: undefined,
    destinationKey: getStopoverKey(checkin.destination),
    fields: {
      body: typeof status.body === 'string' ? status.body : '',
      business: status.business,
      visibility: status.visibility,
    },
  }));

  const setValue: EditStatusFormContextValue['setValue'] = (key, value) => {
    setValues((previousValues) => ({ ...previousValues, [key]: value }));
  };

  const setFieldValue: EditStatusFormContextValue['setFieldValue'] = (key, value) => {
    setValues((previousValues) => ({ ...previousValues, fields: { ...previousValues.fields, [key]: value } }));
  };

  const destination =
    destinationStopovers.find((stopover) => getStopoverKey(stopover) === values.destinationKey) ?? checkin.destination;
  const destinationChanged = !isSameStopover(destination, checkin.destination);

  // A changed destination brings its own arrival time, an earlier manual one belongs to the old destination
  const currentTimes = getCheckinTimes(checkin);
  const liveArrival = destination.arrivalReal ?? destination.arrivalPlanned;
  const liveDeparture = checkin.origin.departureReal ?? checkin.origin.departurePlanned;
  const fallbackArrival = values.arrival === null || destinationChanged ? liveArrival : currentTimes.arrival;
  const fallbackDeparture = values.departure === null ? liveDeparture : currentTimes.departure;
  const arrival = values.arrival ?? (fallbackArrival ? toDatetimeLocalValue(fallbackArrival) : '');
  const departure = values.departure ?? (fallbackDeparture ? toDatetimeLocalValue(fallbackDeparture) : '');

  const canResetArrival =
    values.arrival !== null && (values.arrival !== undefined || (!destinationChanged && !!checkin.manualArrival));
  const canResetDeparture = values.departure !== null && (values.departure !== undefined || !!checkin.manualDeparture);

  const [error, formAction, isPending] = useActionState(async (_previousError: string | undefined) => {
    const body: StatusUpdateBody = {
      body: values.fields.body || null,
      business: values.fields.business,
      visibility: values.fields.visibility,
    };

    if (destinationChanged) {
      body.destinationId = String(destination.station.id);
      body.destinationArrivalPlanned = destination.arrivalPlanned ?? destination.departurePlanned;
    }

    if (values.departure !== undefined) {
      body.manualDeparture = toIsoString(values.departure);
    }

    if (values.arrival !== undefined) {
      body.manualArrival = toIsoString(values.arrival);
    } else if (destinationChanged && checkin.manualArrival) {
      body.manualArrival = null;
    }

    const result = await updateStatusAction(status.id, body);

    if (!result.success) {
      return result.message;
    }

    onSuccess();
  }, undefined);

  return (
    <EditStatusFormContext
      value={{
        arrival,
        canResetArrival,
        canResetDeparture,
        departure,
        destinationStopovers,
        error,
        formAction,
        formId,
        isPending,
        setFieldValue,
        setValue,
        values,
      }}
    >
      {children}
    </EditStatusFormContext>
  );
};

export function useEditStatusForm() {
  const context = use(EditStatusFormContext);

  if (!context) {
    throw new Error('useEditStatusForm must be used within an EditStatusFormProvider');
  }

  return context;
}
