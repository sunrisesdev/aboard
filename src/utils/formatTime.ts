export const formatTime = (value: Date) => {
  return value.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};
