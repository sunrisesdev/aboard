import { CompleteCheckInOverlay } from '@/overlays/CompleteCheckIn/CompleteCheckIn.overlay';
import { SelectDestinationOverlay } from '@/overlays/SelectDestination/SelectDestination.overlay';
import { CheckinInput } from '@/traewelling-sdk/functions/trains';
import { AboardStatus, AboardTrip } from '@/types/aboard';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCheckIn } from '../useCheckIn/useCheckIn';
import { useConsecutiveOverlays } from '../useConsecutiveOverlays/useConsecutiveOverlays';

const post = async (status: CheckinInput, session?: Session | null) => {
  const token = session?.user.accessToken;

  if (!token) {
    return;
  }

  const response = await fetch('/traewelling/stations/checkin', {
    body: JSON.stringify(status),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw response;
  }

  return await response.json();
};

export const useJoinCheckIn = () => {
  const { join, state, perform, reportFailure, reportSuccess, reset } =
    useCheckIn();
  const router = useRouter();
  const { data: session } = useSession();

  const { completeProps, destinationProps, next, setActive } =
    useConsecutiveOverlays(['destination', 'complete']);

  const handleDestinationComplete = () => {
    next();
  };

  const startOrResume = (
    status: AboardStatus,
    trip: AboardTrip | undefined
  ) => {
    if (state.trip?.hafasId !== trip?.hafasId) {
      join({ status, trip });
    }

    setActive(true);
  };

  useEffect(() => {
    if (state.status !== 'ready') return;

    async function performCheckIn() {
      perform();

      try {
        const departureStop = state.trip?.stopovers?.find(
          (stop) =>
            stop.station.evaId === state.origin?.evaId &&
            new Date(stop.departure.planned!).toISOString() ===
              new Date(state.departureTime!).toISOString()
        );

        await post(
          {
            arrival: state.destination?.arrival.planned!,
            body: state.message,
            business: state.travelReason,
            departure: departureStop?.departure.planned!,
            destination: state.destination?.station.evaId!,
            ibnr: true,
            lineName: state.trip?.line.name!,
            start: departureStop?.station.evaId!,
            tripId: state.hafasId!,
            visibility: state.visibility,
          },
          session
        );

        reportSuccess({});
        reset();
        router.push('/dashboard');
      } catch (error) {
        reportFailure({ error });
      }
    }

    performCheckIn();

    // We should be able to safely discard everything else here, because state.status is guaranteed to change simultaneously
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  const content = (
    <>
      <SelectDestinationOverlay
        {...destinationProps}
        onBackdropTap={() => setActive(false)}
        onComplete={handleDestinationComplete}
      />

      <CompleteCheckInOverlay
        {...completeProps}
        onBackdropTap={() => setActive(false)}
        onComplete={() => void 0}
      />
    </>
  );

  return {
    content,
    startOrResume,
  };
};
