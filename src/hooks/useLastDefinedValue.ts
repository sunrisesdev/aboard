'use client';

import { useState } from 'react';

// Keeps showing the last value while it is being reset, e.g. so content stays visible during an exit animation.
export function useLastDefinedValue<T>(value: T | undefined) {
  const [lastValue, setLastValue] = useState(value);

  if (value !== undefined && value !== lastValue) {
    setLastValue(value);
  }

  return value ?? lastValue;
}
