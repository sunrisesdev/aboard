import { LiveCheckIn } from '@/contexts/LiveCheckIn/types';

export type LiveCheckInPartProps = {
  checkIn: LiveCheckIn;
  hasSubsequentChangeover?: boolean;
};
