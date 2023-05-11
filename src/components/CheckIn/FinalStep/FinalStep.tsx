'use client';

import LineIndicator from '@/components/LineIndicator/LineIndicator';
import ScrollArea from '@/components/ScrollArea/ScrollArea';
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider';
import { LiveCheckInContext } from '@/contexts/LiveCheckIn/LiveCheckIn.context';
import { getLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import useAppTheme from '@/hooks/useAppTheme/useAppTheme';
import { parseSchedule } from '@/utils/parseSchedule';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useContext } from 'react';
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
                  <RadioGroup.Item
                    className={styles.radioItem}
                    value="business"
                  >
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
                  <RadioGroup.Item
                    className={styles.radioItem}
                    value="unlisted"
                  >
                    <MdFilterListOff size={18} />
                  </RadioGroup.Item>
                  <RadioGroup.Item
                    className={styles.radioItem}
                    value="followers"
                  >
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
    </ThemeProvider>
  );
};

export default FinalStep;
