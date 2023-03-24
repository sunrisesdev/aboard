type ParseScheduleOptions = {
  actual?: string | null;
  delay?: number | null;
  planned: string;
};

export type Schedule = ReturnType<typeof parseSchedule>;

export const parseSchedule = ({
  actual,
  delay,
  planned,
}: ParseScheduleOptions) => {
  const plannedDate = new Date(planned);
  const plannedValue = plannedDate.getTime();

  let actualDate: Date;
  let actualValue: number;
  let delayInMinutes: number;

  if (actual) {
    actualDate = new Date(actual);
    actualValue = actualDate.getTime();
    delayInMinutes = (actualValue - plannedValue) / 1000 / 60;
  } else if (delay !== undefined && delay !== null) {
    actualValue = plannedValue + delay;
    actualDate = new Date(actualValue);
    delayInMinutes = delay / 60;
  } else {
    actualValue = plannedValue;
    actualDate = new Date(actualValue);
    delayInMinutes = 0;
  }

  return {
    actual: actualDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    delayInMinutes,
    isDelayed: delayInMinutes > 0,
    isEarly: delayInMinutes < 0,
    isOnTime: delayInMinutes === 0,
    planned: plannedDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};
