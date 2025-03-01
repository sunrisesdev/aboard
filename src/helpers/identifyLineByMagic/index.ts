import { AboardLine } from '@/types/aboard';
import { WELL_KNOWN_LINES } from './conts';

export const identifyLineByMagic = (
  hafasTripId: string | undefined,
  line: AboardLine
): AboardLine => {
  if (!hafasTripId) return line;

  const fr = hafasTripId.match(/#FR#(\d+)#/)?.[1];
  const to = hafasTripId.match(/#TO#(\d+)#/)?.[1];

  if (!fr || !to) return line;

  const wellKnownLine = WELL_KNOWN_LINES.find(
    (l) =>
      l.name === line.name &&
      l.stations.includes(+fr) &&
      l.stations.includes(+to)
  );

  if (!wellKnownLine) return line;

  return {
    ...line,
    id: wellKnownLine.id,
    operator: wellKnownLine.operator
      ? { id: wellKnownLine.operator, name: '' }
      : undefined,
  };
};
