export const getContrastColor = (r: number, g: number, b: number) => {
  return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? '#000000' : '#FFFFFF';
};
