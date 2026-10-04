'use client';

import { createContext, type PropsWithChildren, use, useActionState, useId } from 'react';
import { submitCheckinAction } from '@/checkin/actions';
import { useCheckIn } from '@/checkin/useCheckIn';
import type { Business } from '@/lib/traewelling';

type CheckInFormContextValue = {
  error: string | undefined;
  formAction: (formData: FormData) => void;
  formId: string;
  isPending: boolean;
};

const CheckInFormContext = createContext<CheckInFormContextValue | undefined>(undefined);

// Shares the submit state between the form and a submit button rendered outside of it (e.g. in a footer).
// Mount it inside the popup so the state resets whenever the popup closes.
export const CheckInFormProvider = ({ children }: PropsWithChildren) => {
  const {
    dispatch,
    state: { departure, destination },
    trip: { boardingStopover },
  } = useCheckIn();
  const formId = useId();

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

  return <CheckInFormContext value={{ error, formAction, formId, isPending }}>{children}</CheckInFormContext>;
};

export const useCheckInForm = () => {
  const context = use(CheckInFormContext);

  if (!context) {
    throw new Error('useCheckInForm must be used within a CheckInFormProvider');
  }

  return context;
};
