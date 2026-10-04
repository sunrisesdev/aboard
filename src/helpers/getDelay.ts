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
