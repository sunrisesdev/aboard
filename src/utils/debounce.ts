export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  waitFor: number
) => {
  if (typeof window === 'undefined') {
    return fn;
  }

  let timeoutId: number;

  return (...args: Parameters<T>) => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => fn.call(null, ...args), waitFor);
  };
};
