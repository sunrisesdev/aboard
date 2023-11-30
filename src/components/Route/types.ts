import { Schedule } from '@/utils/parseSchedule';
import { ReactNode } from 'react';

export type RouteProps = {
  children: ReactNode;
  className?: string;
};

export type RouteEntryProps = {
  children?: ReactNode;
  className?: string;
  lineSlot?: ReactNode;
  stopIndicatorVariant?: RouteStopIndicatorProps['variant'];
};

export type RouteLineProps = {
  variant?: 'default' | 'hybrid' | 'partial';
};

export type RouteStopIndicatorProps = {
  className?: string;
  variant?: 'default' | 'pulsating';
};

export type RouteTimeProps = {
  schedule: Schedule;
  type: 'arrival' | 'departure';
};
