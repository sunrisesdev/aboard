import { Schedule } from '@/utils/parseSchedule';
import { CSSProperties } from 'react';

export type TimeProps = {
  delayStyle: 'hidden' | 'p+a' | 'p+d';
  schedule: Schedule;
  style?: CSSProperties;
  type?: 'arrival' | 'departure';
};
