'use client';

import { createContext, type PropsWithChildren, use, useActionState, useId, useState } from 'react';
import { submitCheckinAction } from '@/checkin/actions';
import { useCheckIn } from '@/checkin/useCheckIn';
import type { Business, StatusVisibility } from '@/lib/traewelling';
import { useUser } from '@/user/useUser';

type CheckInFormValues = {
  body: string;
  business: Business;
  visibility: StatusVisibility;
};

type CheckInFormContextValue = {
  error: string | undefined;
  formAction: () => void;
  formId: string;
  isPending: boolean;
  setValue: <Key extends keyof CheckInFormValues>(key: Key, value: CheckInFormValues[Key]) => void;
  values: CheckInFormValues;
};

const CheckInFormContext = createContext<CheckInFormContextValue | undefined>(undefined);

// Shares the form values and submit state between the form, a submit button rendered outside of it (e.g. in a footer)
// and fields whose controls live in a portal (e.g. a nested drawer).
// Mount it inside the popup so the state resets whenever the popup closes.
export const CheckInFormProvider = ({ children }: PropsWithChildren) => {
  const {
    dispatch,
    state: { departure, destination },
    trip: { boardingStopover },
  } = useCheckIn();
  const { defaultStatusVisibility } = useUser();
  const formId = useId();
  const [values, setValues] = useState<CheckInFormValues>(() => ({
    body: '',
    business: 0,
    visibility: defaultStatusVisibility as StatusVisibility,
  }));

  const setValue: CheckInFormContextValue['setValue'] = (key, value) => {
    setValues((previousValues) => ({ ...previousValues, [key]: value }));
  };

  const [error, formAction, isPending] = useActionState(async (_previousError: string | undefined) => {
    const arrival = destination?.arrivalPlanned ?? destination?.departurePlanned;

    if (!departure || !boardingStopover || !destination || !arrival) {
      return 'Die Fahrt konnte nicht zugeordnet werden.';
    }

    const result = await submitCheckinAction({
      arrival,
      body: values.body || null,
      business: values.business,
      departure: boardingStopover.departurePlanned ?? departure.plannedWhen,
      destination: destination.station.id,
      lineName: departure.line.name ?? '',
      start: boardingStopover.station.id,
      tripId: departure.tripId,
      visibility: values.visibility,
    });

    if (!result.success) {
      return result.message;
    }

    dispatch({ type: 'reset' });
  }, undefined);

  return (
    <CheckInFormContext value={{ error, formAction, formId, isPending, setValue, values }}>
      {children}
    </CheckInFormContext>
  );
};

export const useCheckInForm = () => {
  const context = use(CheckInFormContext);

  if (!context) {
    throw new Error('useCheckInForm must be used within a CheckInFormProvider');
  }

  return context;
};
