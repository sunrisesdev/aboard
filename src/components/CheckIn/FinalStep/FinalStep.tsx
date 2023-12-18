'use client';

import { NewLineIndicator } from '@/components/NewLineIndicator/NewLineIndicator';
import ScrollArea from '@/components/ScrollArea/ScrollArea';
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider';
import useAppTheme from '@/hooks/useAppTheme/useAppTheme';
import { parseSchedule } from '@/utils/parseSchedule';
import colorConvert from 'color-convert';
import { useContext, useId } from 'react';
import {
  MdArrowBack,
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
import { METHOD_ICONS } from '../consts';
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
    setMessage,
    setTravelType,
    setVisibility,
    travelType,
    trip,
    visibility,
  } = useContext(CheckInContext);

  const arrivalSchedule = parseSchedule({
    actual: destination?.arrival,
    planned: destination?.arrivalPlanned!,
  });

  const departureSchedule = parseSchedule({
    actual: trip?.departure?.actual,
    planned: trip?.departure?.planned!,
  });

  const travelTypeId = useId();
  const visibilityId = useId();

  useAppTheme(trip?.line.appearance.accentColor);

  const accentRGB = colorConvert.hex
    .rgb(trip!.line.appearance.accentColor!)
    .join(', ');
  const contrastRGB = colorConvert.hex
    .rgb(trip!.line.appearance.contrastColor!)
    .join(', ');

  return (
    <ThemeProvider
      color={trip!.line.appearance.accentColor}
      colorRGB={accentRGB}
      contrast={trip!.line.appearance.contrastColor}
      contrastRGB={contrastRGB}
    >
      <main className={styles.base}>
        <header className={styles.header}>
          <div className={styles.buttons}>
            <button className={styles.backButton} onClick={goBack}>
              <div className={styles.arrow}>
                <MdArrowBack size={20} />
              </div>
              {trip && (
                <div className={styles.lineName}>
                  {METHOD_ICONS[trip.line.method]({
                    className: styles.productIcon,
                  })}

                  <NewLineIndicator line={trip.line} />
                </div>
              )}
            </button>

            <button className={styles.confirmButton} onClick={checkIn}>
              <MdCheck size={20} />
            </button>
          </div>

          <div className={styles.direction}>{trip?.designation}</div>

          {trip?.departureStation.name !== origin?.name && (
            <div className={styles.deviationNotice}>
              <MdMergeType size={18} />
              <span>Abweichende Abfahrt von einer Station in der Nähe</span>
            </div>
          )}

          <div className={styles.origin}>
            <div className={styles.station}>
              <div>{trip?.departureStation.name}</div>
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
        </header>

        <div className={styles.sheet}>
          <ScrollArea className={styles.scrollArea} topFogBorderRadius="1rem">
            <div className={styles.content}>
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
