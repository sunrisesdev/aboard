export const formatDate = (value: Date) => {
  return value.toLocaleDateString([], {
    dateStyle: 'full',
  });
};
