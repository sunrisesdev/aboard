import { formatMinutes } from './formatMinutes';

export function formatDuration(start: string, end: string) {
  return formatMinutes((new Date(end).getTime() - new Date(start).getTime()) / 60_000);
}
