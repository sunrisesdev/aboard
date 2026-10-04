export function normalizeHexColor(value?: string) {
  if (!value) return;

  const safeHexValue = String(value).replace(/[^0-9a-f]/gi, '');
  if (safeHexValue.length !== 6) return;

  return `#${safeHexValue}`;
}
