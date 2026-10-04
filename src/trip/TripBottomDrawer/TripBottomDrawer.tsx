'use client';

import { CheckInBottomDrawer } from '@/checkin/CheckInBottomDrawer/CheckInBottomDrawer';
import { useCheckIn } from '@/checkin/useCheckIn';
import { BottomDrawer } from '@/components/BottomDrawer/BottomDrawer';
import { useLastDefinedValue } from '@/hooks/useLastDefinedValue';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { TripDetails } from '@/trip/TripDetails/TripDetails';

export const TripBottomDrawer = () => {
  const {
    dispatch,
    state: { departure },
  } = useCheckIn();
  const displayedDeparture = useLastDefinedValue(departure);
  const isWide = useMediaQuery('(width >= 64em)');

  return (
    <BottomDrawer
      open={Boolean(departure) && !isWide}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: 'reset' });
      }}
    >
      <BottomDrawer.Content>
        {displayedDeparture && <TripDetails departure={displayedDeparture} inDrawer />}
      </BottomDrawer.Content>

      <CheckInBottomDrawer />
    </BottomDrawer>
  );
};
