import Button from '@/components/Button/Button';
import LineIndicator from '@/components/LineIndicator/LineIndicator';
import { NativeSelect } from '@/components/NativeSelect/NativeSelect';
import { Overlay } from '@/components/Overlay/Overlay';
import Route from '@/components/Route/Route';
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider';
import { Time } from '@/components/Time/Time';
import { getLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import { useCheckIn } from '@/hooks/useCheckIn/useCheckIn';
import { caveat, radioCanada } from '@/styles/fonts';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  MdFilterListOff,
  MdFingerprint,
  MdOutlineBeachAccess,
  MdOutlineGroups,
  MdOutlineLockOpen,
  MdOutlineLockPerson,
  MdSwapCalls,
  MdWorkOutline,
} from 'react-icons/md';
import styles from './CompleteCheckIn.module.scss';
import { CompleteCheckInOverlayProps } from './types';

const TRAVEL_TYPES = [
  {
    icon: <MdOutlineBeachAccess size={18} />,
    name: 'Ich reise privat',
  },
  {
    icon: <MdWorkOutline size={18} />,

    name: 'Ich reise beruflich',
  },
  {
    icon: <MdSwapCalls size={18} />,
    name: 'Ich pendele zur Arbeit/nach Hause',
  },
];

const VISIBILITIES = [
  {
    icon: <MdOutlineLockOpen size={18} />,
    name: 'Alle',
  },
  {
    icon: <MdFilterListOff size={18} />,
    name: 'Alle mit dem Link',
  },
  {
    icon: <MdOutlineGroups size={18} />,
    name: 'Nur Follower',
  },
  {
    icon: <MdOutlineLockPerson size={18} />,
    name: 'Nur ich',
  },
  {
    icon: <MdFingerprint size={18} />,
    name: 'Nur angemeldete Personen',
  },
];

export const CompleteCheckInOverlay = ({
  onComplete,
  ...overlayProps
}: CompleteCheckInOverlayProps) => {
  const { confirm, state } = useCheckIn();

  const [message, setMessage] = useState(state.message);
  const [travelType, setTravelType] = useState(state.travelType);
  const [visibility, setVisibility] = useState(state.visibility);

  const arrivalSchedule = parseSchedule({
    actual: state.destination?.arrivalReal,
    planned: state.destination?.arrivalPlanned ?? '',
  });

  const departureStop = state.trip?.stopovers.find(
    (stop) => stop.evaIdentifier === state.origin?.ibnr
  );

  const departureSchedule = parseSchedule({
    actual: departureStop?.departureReal,
    planned: departureStop?.departurePlanned ?? '',
  });

  const handleCheckInClicked = async () => {
    confirm({ message, travelType, visibility });

    await onComplete();
  };

  const theme = getLineTheme(
    state.trip?.number ?? '',
    state.trip?.category ?? 'regional'
  );

  return (
    <Overlay
      {...overlayProps}
      className={radioCanada.className}
      initialSnapPosition={0}
      style={{
        backgroundColor: `${theme.accent}`,
      }}
    >
      <ThemeProvider theme={theme}>
        <header className={styles.header}>
          {state.trip && (
            <div className={styles.trip}>
              <LineIndicator
                isInverted
                lineId={state.trip.number}
                lineName={state.trip.lineName}
                product={state.trip.category}
              />
              <span className={styles.direction}>
                {state.trip.destination.name}
              </span>
            </div>
          )}

          <Route>
            <Route.Entry
              lineSlot={<Route.Line />}
              stopIndicatorVariant="default"
            >
              <div className={styles.routeContent} data-station="start">
                <div>{state.origin?.name}</div>

                <Time
                  delayStyle="p+d"
                  schedule={departureSchedule}
                  style={{ marginTop: '0.25rem' }}
                  type="departure"
                />
              </div>
            </Route.Entry>

            <Route.Entry stopIndicatorVariant="default">
              <div className={styles.routeContent} data-station="end">
                <div>{state.destination?.name}</div>

                <Time
                  delayStyle="p+d"
                  schedule={arrivalSchedule}
                  style={{ marginTop: '0.25rem' }}
                  type="arrival"
                />
              </div>
            </Route.Entry>
          </Route>
        </header>

        <Overlay.ScrollArea>
          <div className={styles.content}>
            <section>
              <label className={styles.label} htmlFor="message">
                <span>Status-Nachricht</span>
                <span
                  style={{
                    backgroundColor: '#9E0A5B20',
                    borderRadius: '0.25rem',
                    color: '#9E0A5B',
                    fontSize: '0.75rem',
                    marginLeft: '0.5rem',
                    padding: '0 0.25rem',
                  }}
                >
                  optional
                </span>

                <span className={styles.characterLimit}>
                  {message.length}/280
                </span>
              </label>

              <textarea
                className={styles.textarea}
                id="message"
                maxLength={280}
                onChange={(ev) => setMessage(ev.target.value)}
                value={message}
              />
            </section>

            <section>
              <label className={styles.label}>Wie bist du unterwegs?</label>
              <NativeSelect
                onSelect={(value) => setTravelType(+value)}
                options={TRAVEL_TYPES.map(({ name }, index) => (
                  <option key={name} value={index}>
                    {name}
                  </option>
                ))}
                value={travelType.toString()}
              >
                {TRAVEL_TYPES[travelType].icon}
                <span>{TRAVEL_TYPES[travelType].name}</span>
              </NativeSelect>
            </section>

            <section>
              <label className={styles.label}>
                Wer darf diesen Check-In sehen?
              </label>
              <NativeSelect
                onSelect={(value) => setVisibility(+value)}
                options={VISIBILITIES.map(({ name }, index) => (
                  <option key={name} value={index}>
                    {name}
                  </option>
                ))}
                value={visibility.toString()}
              >
                {VISIBILITIES[visibility].icon}
                <span>{VISIBILITIES[visibility].name}</span>
              </NativeSelect>
            </section>

            <Button
              className={styles.button}
              onClick={handleCheckInClicked}
              variant="secondary"
            >
              Check-In
            </Button>

            {state.status === 'loading' && (
              <motion.article
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className={styles.loadingSheet}
                style={{ opacity: 0, scale: 0.95 }}
              >
                <div className={clsx(caveat.className, styles.loadingText)}>
                  <span>Bitte warte einen Moment,</span>
                  <span>während wir dich einchecken</span>
                </div>

                <div className={styles.loadingIndicator}>
                  <svg
                    height={20}
                    version="1.1"
                    width="100%"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      strokeDasharray="0.1 6"
                      x1={0}
                      y1={10}
                      x2="100%"
                      y2={10}
                      stroke="rgba(var(--accent-rgb, 255, 255, 255), 0.5)"
                      strokeWidth="2px"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className={styles.progress} />

                  <div className={styles.stops}>
                    <Route.StopIndicator className={styles.stop} />
                    <Route.StopIndicator className={styles.stop} />
                    <Route.StopIndicator className={styles.stop} />
                    <Route.StopIndicator className={styles.stop} />
                  </div>
                </div>
              </motion.article>
            )}
          </div>
        </Overlay.ScrollArea>
      </ThemeProvider>
    </Overlay>
  );
};
