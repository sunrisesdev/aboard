import { formatTime } from './formatTime';

// E.g. "+5 · statt 13:37", with a real minus sign for early times
export function formatDelay(minutes: number, planned: string) {
  return `${minutes > 0 ? '+' : '−'}${Math.abs(minutes)} · statt ${formatTime(planned)}`;
}
