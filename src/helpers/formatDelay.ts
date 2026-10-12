import { formatDateTime } from './formatDateTime';

// E.g. "+5", or "+5 · statt 13:37" with `planned`. Uses a real minus sign for early times.
export function formatDelay(minutes: number, { planned }: { planned?: string } = {}) {
  const formattedMinutes = `${minutes > 0 ? '+' : '−'}${Math.abs(minutes)}`;

  return planned ? `${formattedMinutes} · statt ${formatDateTime(planned, 'time')}` : formattedMinutes;
}
