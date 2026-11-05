import { formatDateTime } from './dateTime';

const lateThresholdInMinutes = 6;

export function getDelay(planned: string, actual?: string | null) {
  const difference = new Date(actual ?? planned).getTime() - new Date(planned).getTime();
  const minutes = Math.round(difference / 60_000);

  if (minutes < 0) {
    return { minutes, status: 'early' } as const;
  }

  if (minutes >= lateThresholdInMinutes) {
    return { minutes, status: 'late' } as const;
  }

  return { minutes, status: minutes > 0 ? 'slight' : 'onTime' } as const;
}

// E.g. "+5", or "+5 · statt 13:37" with `planned`. Uses a real minus sign for early times.
export function formatDelay(minutes: number, { planned }: { planned?: string } = {}) {
  const formattedMinutes = `${minutes > 0 ? '+' : '−'}${Math.abs(minutes)}`;

  return planned ? `${formattedMinutes} · statt ${formatDateTime(planned, 'time')}` : formattedMinutes;
}
