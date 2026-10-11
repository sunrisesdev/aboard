// Strips leading zeros in front of digits only, so alphanumeric numbers like "00123A" keep their letters.
const leadingZerosPattern = /^0+(?=\d)/;

export function formatJourneyNumber(journeyNumber: string | null | undefined) {
  return journeyNumber?.trim().replace(leadingZerosPattern, '') || undefined;
}
