import { IconArrowMergeAltRight } from '@tabler/icons-react';
import { clsx } from 'clsx';
import type { CSSProperties } from 'react';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { Marquee } from '@/components/Marquee/Marquee';
import { TransportModeIcon } from '@/components/TransportModeIcon/TransportModeIcon';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDelay } from '@/helpers/formatDelay';
import { formatPlatform } from '@/helpers/formatPlatform';
import { getDelay } from '@/helpers/getDelay';
import { getDeparturePlatform } from '@/helpers/getDeparturePlatform';
import { getDepartureTime } from '@/helpers/getDepartureTime';
import { getLineColors } from '@/helpers/getLineColors';
import { isReplacementService } from '@/helpers/isReplacementService';
import type { DepartureResource, MotisMode } from '@/lib/traewelling';
import styles from './DepartureTripItem.module.css';
import { formatJourneyNumber } from './formatJourneyNumber';

export const DepartureTripItem = ({
  departure,
  lessInformation = false,
  onSelect,
  stationId,
}: {
  departure: DepartureResource;
  lessInformation?: boolean;
  onSelect?: () => void;
  stationId: string;
}) => {
  const { background: modeBackground = 'var(--via-fg-primary)', foreground: modeForeground = 'var(--via-bg-surface)' } =
    getLineColors({ mode: departure.line.mode });

  const replacementService = isReplacementService(departure);
  const time = getDepartureTime(departure);
  const delay = getDelay(departure.plannedWhen, departure.when);
  const hasDeparted = new Date(time).setSeconds(0, 0) < new Date().setSeconds(0, 0);
  const journeyNumber = formatJourneyNumber(departure.line.fahrtNr);

  const statusLineText = [
    departure.line.fahrtNr !== departure.line.name && journeyNumber,
    formatPlatform(getDeparturePlatform(departure), departure.line.mode, { planned: departure.plannedPlatform }),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <button
      className={clsx(styles.base, hasDeparted && styles.hasDeparted, departure.cancelled && styles.isCancelled)}
      onClick={() => onSelect?.()}
      style={{ '--via-line-bg': modeBackground, '--via-line-fg': modeForeground } as CSSProperties}
      type="button"
    >
      <div className={styles.topLine}>
        <LineBadge
          backgroundColor={departure.line.color ?? undefined}
          color={departure.line.textColor ?? undefined}
          journeyNumber={departure.line.fahrtNr}
          mode={departure.line.mode as MotisMode | undefined}
          name={departure.line.name}
          productName={departure.line.product ?? undefined}
        />
        <Marquee className={styles.direction}>{cleanStationName(departure.direction)}</Marquee>

        {lessInformation && journeyNumber ? (
          <span
            className={styles.statusLine}
            style={{ alignSelf: 'center', gap: '0.25rem', marginBlock: '-3.25px', paddingBlock: '0.125rem' }}
          >
            <TransportModeIcon
              height={16}
              icon={replacementService ? 'replacement-bus' : undefined}
              mode={departure.line.mode ?? undefined}
              width={16}
            />
            {journeyNumber}
          </span>
        ) : (
          <span className={styles.delay} data-via-delay={departure.cancelled ? 'late' : delay.status}>
            {departure.cancelled
              ? 'Fällt aus'
              : delay.minutes !== 0
                ? formatDelay(delay.minutes, { planned: departure.plannedWhen })
                : 'pünktlich'}
          </span>
        )}
      </div>

      {!lessInformation && (
        <div className={styles.statusLine}>
          <TransportModeIcon
            icon={replacementService ? 'replacement-bus' : undefined}
            mode={departure.line.mode ?? undefined}
          />

          {replacementService && <span style={{ color: 'light-dark(#86245a, #f9af42)', fontWeight: 500 }}>SEV</span>}

          {statusLineText && <span style={{ whiteSpace: 'nowrap' }}>{statusLineText}</span>}

          {departure.station.id !== Number(stationId) && (
            <>
              <IconArrowMergeAltRight
                data-via-icon
                style={{ fontSize: '1rem', marginBottom: '0.09375rem', marginRight: '-0.25rem', rotate: '45deg' }}
              />
              <Marquee className={styles.origin}>ab {departure.station.name}</Marquee>
            </>
          )}
        </div>
      )}
    </button>
  );
};
