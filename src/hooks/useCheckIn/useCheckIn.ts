import { CheckInContext } from '@/contexts/CheckIn/CheckIn.context';
import { useContext } from 'react';

export const useCheckIn = () => {
  return useContext(CheckInContext);
};
