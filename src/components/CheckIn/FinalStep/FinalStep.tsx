'use client';

import LineIndicator from '@/components/LineIndicator/LineIndicator';
import ScrollArea from '@/components/ScrollArea/ScrollArea';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useContext } from 'react';
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
import { CheckInContext } from '../CheckIn.context';
import { PRODUCT_ICONS } from '../consts';
import styles from './FinalStep.module.scss';

const TRAVEL_TYPES = ['private', 'business', 'commute'];
const VISIBILITIES = [
  'public',
  'unlisted',
  'followers',
  'private',
  'authenticated',
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

  const arrival =
    (!!destination?.arrivalPlanned && new Date(destination.arrivalPlanned)) ||
    undefined;

  const arrivalTime = arrival?.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const arrivalDelay =
    (arrival &&
      !!destination?.arrival &&
      Math.floor(
        Math.abs(arrival.getTime() - new Date(destination.arrival).getTime()) /
          1000 /
          60
      )) ||
    0;

  const departure = trip && new Date(trip.plannedWhen);

  const departureTime = departure?.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <main
      className={styles.base}
      style={{
        ['--accent-color' as any]: `var(--color-${trip?.line.product})`,
      }}
    >
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
                  className={styles.lineIndicator}
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
              ab {departureTime}
              {trip && trip.delay > 0 && (
                <span className={styles.delay}>
                  &nbsp;<sup>+{trip.delay / 60}</sup>
                </span>
              )}
            </span>
          </div>
        </div>

        <div className={styles.destination}>
          <div className={styles.station}>
            <div>{destination?.name}</div>
            <span className={styles.time}>
              an {arrivalTime}
              {arrivalDelay > 0 && (
                <span className={styles.delay}>
                  &nbsp;<sup>+{arrivalDelay}</sup>
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

              <RadioGroup.Root
                className={styles.radioGroup}
                id="travelType"
                onValueChange={(value) =>
                  setTravelType(TRAVEL_TYPES.indexOf(value))
                }
                value={TRAVEL_TYPES[travelType]}
              >
                <RadioGroup.Item className={styles.radioItem} value="private">
                  <MdOutlineBeachAccess size={18} />
                  <span>Privat</span>
                </RadioGroup.Item>
                <RadioGroup.Item className={styles.radioItem} value="business">
                  <MdWorkOutline size={18} />
                  <span>Beruflich</span>
                </RadioGroup.Item>
                <RadioGroup.Item className={styles.radioItem} value="commute">
                  <MdSwapCalls size={18} />
                  <span>Pendeln</span>
                </RadioGroup.Item>
              </RadioGroup.Root>
            </section>

            <section>
              <label className={styles.label} htmlFor="travelType">
                Wer darf diesen Check-In sehen?
              </label>

              <RadioGroup.Root
                className={styles.radioGroup}
                id="visibility"
                onValueChange={(value) =>
                  setVisibility(VISIBILITIES.indexOf(value))
                }
                value={VISIBILITIES[visibility]}
              >
                <RadioGroup.Item className={styles.radioItem} value="public">
                  <MdOutlineLockOpen size={18} />
                </RadioGroup.Item>
                <RadioGroup.Item className={styles.radioItem} value="unlisted">
                  <MdFilterListOff size={18} />
                </RadioGroup.Item>
                <RadioGroup.Item className={styles.radioItem} value="followers">
                  <MdOutlineGroups size={18} />
                </RadioGroup.Item>
                <RadioGroup.Item className={styles.radioItem} value="private">
                  <MdOutlineLockPerson size={18} />
                </RadioGroup.Item>
                <RadioGroup.Item
                  className={styles.radioItem}
                  value="authenticated"
                >
                  <MdFingerprint size={18} />
                </RadioGroup.Item>
              </RadioGroup.Root>
            </section>

            {!!error && <article className={styles.error}>{error}</article>}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
};

export default FinalStep;
