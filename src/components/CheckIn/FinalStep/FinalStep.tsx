'use client';

import LineIndicator from '@/components/LineIndicator/LineIndicator';
import ScrollArea from '@/components/ScrollArea/ScrollArea';
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider';
import { LiveCheckInContext } from '@/contexts/LiveCheckIn/LiveCheckIn.context';
import { getLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import useAppTheme from '@/hooks/useAppTheme/useAppTheme';
import { parseSchedule } from '@/utils/parseSchedule';
import { useContext, useId } from 'react';
import {
  MdArrowBack,
  MdAutoMode,
  MdCheck,
  MdFilterListOff,
  MdFingerprint,
  MdMergeType,
  MdOutlineBeachAccess,
  MdOutlineGroups,
  MdOutlineLockOpen,
  MdOutlineLockPerson,
  MdSwapCalls,
  MdWorkOutline,
} from 'react-icons/md';
import { TbChevronDown } from 'react-icons/tb';
import { CheckInContext } from '../CheckIn.context';
import { PRODUCT_ICONS } from '../consts';
import styles from './FinalStep.module.scss';

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

const FinalStep = () => {
  const {
    checkIn,
    destination,
    error,
    goBack,
    message,
    origin,
    reset,
    setMessage,
    setTravelType,
    setVisibility,
    travelType,
    trip,
    visibility,
  } = useContext(CheckInContext);

  const { addCheckIn } = useContext(LiveCheckInContext);

  const arrivalSchedule = parseSchedule({
    actual: destination?.arrival,
    planned: destination?.arrivalPlanned!,
  });

  const departureSchedule = parseSchedule({
    actual: trip?.when,
    delay: trip?.delay,
    planned: trip?.plannedWhen!,
  });

  const handleLiveCheckInButtonClick = () => {
    addCheckIn(trip!, destination!);
    reset();
  };

  const theme = getLineTheme(trip!.line.id, trip!.line.product);

  const travelTypeId = useId();
  const visibilityId = useId();

  useAppTheme(theme.accent);

  return (
    <ThemeProvider theme={theme}>
      <main className={styles.base}>
        <header className={styles.header}>
          <div className={styles.buttons}>
            <button className={styles.backButton} onClick={goBack}>
              <div className={styles.arrow}>
                <MdArrowBack size={20} />
              </div>
              {trip && (
                <div className={styles.lineName}>
                  {PRODUCT_ICONS[trip.line.product]({
                    className: styles.productIcon,
                  })}
                  <LineIndicator
                    isInverted
                    lineId={trip.line.id}
                    lineName={trip.line.name}
                    product={trip.line.product}
                    productName={trip.line.productName}
                  />
                </div>
              )}
            </button>

            <button className={styles.confirmButton} onClick={checkIn}>
              <MdCheck size={20} />
            </button>
          </div>

          <div className={styles.direction}>{trip?.direction}</div>

          {trip?.station.name !== origin?.name && (
            <div className={styles.deviationNotice}>
              <MdMergeType size={18} />
              <span>Abweichende Abfahrt von einer Station in der Nähe</span>
            </div>
          )}

          <div className={styles.origin}>
            <div className={styles.station}>
              <div>{trip?.station.name}</div>
              <span className={styles.time}>
                ab {departureSchedule.planned}
                {!departureSchedule.isOnTime && (
                  <span className={styles.delay}>
                    &nbsp;<sup>+{departureSchedule.delayInMinutes}</sup>
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className={styles.destination}>
            <div className={styles.station}>
              <div>{destination?.name}</div>
              <span className={styles.time}>
                an {arrivalSchedule.planned}
                {!arrivalSchedule.isOnTime && (
                  <span className={styles.delay}>
                    &nbsp;<sup>+{arrivalSchedule.delayInMinutes}</sup>
                  </span>
                )}
              </span>
            </div>
          </div>

          <article className={styles.liveCheckinBanner}>
            <MdAutoMode className={styles.watermark} size={80} />
            <div>
              <div className={styles.title}>Bist du länger unterwegs?</div>
              <div className={styles.description}>
                Plane deine Reise vor und Aboard checkt dich automatisch ein
              </div>
            </div>

            <button onClick={handleLiveCheckInButtonClick}>
              <MdAutoMode size={20} />
              <span>Live Check-In</span>
            </button>
          </article>
        </header>

        <div className={styles.sheet}>
          <ScrollArea className={styles.scrollArea} topFogBorderRadius="1rem">
            <div className={styles.content}>
              {/* <article className={styles.liveCheckinTeaser}>
                <TbLivePhoto className={styles.watermark} size={96} />

                <div className={styles.title}>Geht die Reise weiter?</div>

                <div className={styles.description}>
                  Verwende den Live Check-In und Aboard checkt automatisch
                  rechtzeitig für dich ein.
                </div>

                <button>
                  <TbLivePhoto size={20} />
                  <span>Zu Live Check-In hinzufügen</span>
                </button>
              </article> */}

              <section>
                <label className={styles.label} htmlFor="message">
                  <span>Status-Nachricht (optional)</span>
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
                <label className={styles.label} htmlFor="travelType">
                  Wie bist du unterwegs?
                </label>

                <div className={styles.selectArea}>
                  <label htmlFor={travelTypeId}>
                    {TRAVEL_TYPES[travelType].icon}
                    <span>{TRAVEL_TYPES[travelType].name}</span>

                    <TbChevronDown className={styles.chevron} />
                  </label>

                  <select
                    id={travelTypeId}
                    onChange={(event) => setTravelType(+event.target.value)}
                    value={travelType}
                  >
                    {TRAVEL_TYPES.map(({ name }, index) => (
                      <option key={name} value={index}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              <section>
                <label className={styles.label} htmlFor="travelType">
                  Wer darf diesen Check-In sehen?
                </label>

                <div className={styles.selectArea}>
                  <label htmlFor={visibilityId}>
                    {VISIBILITIES[visibility].icon}
                    <span>{VISIBILITIES[visibility].name}</span>

                    <TbChevronDown className={styles.chevron} />
                  </label>

                  <select
                    id={visibilityId}
                    onChange={(event) => setVisibility(+event.target.value)}
                    value={visibility}
                  >
                    {VISIBILITIES.map(({ name }, index) => (
                      <option key={name} value={index}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              {!!error && <article className={styles.error}>{error}</article>}
            </div>
          </ScrollArea>
        </div>
      </main>
    </ThemeProvider>
  );
};

export default FinalStep;
