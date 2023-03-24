import { Schedule } from '@/utils/parseSchedule';
import { ReactNode } from 'react';

export type RouteProps = {
  children: ReactNode;
};

export type RouteEntryProps = {
  children?: ReactNode;
  lineSlot?: ReactNode;
  stopIndicatorVariant?: RouteStopIndicatorProps['variant'];
};

export type RouteLineProps = {
  variant?: 'default' | 'hybrid' | 'partial';
};

export type RouteStopIndicatorProps = {
  variant?: 'default' | 'pulsating';
};

export type RouteTimeProps = {
  schedule: Schedule;
  type: 'arrival' | 'departure';
};
