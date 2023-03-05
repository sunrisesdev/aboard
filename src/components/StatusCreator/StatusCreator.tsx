import { useIsDesktop } from '@/hooks/useIsDesktop/useIsDesktop';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {
  MdOutlineBeachAccess,
  MdSwapCalls,
  MdWorkOutline,
} from 'react-icons/md';
import IconSkew from '../IconSkew/IconSkew';
import ScrollArea from '../ScrollArea/ScrollArea';
import styles from './StatusCreator.module.scss';
import { StatusCreatorProps } from './types';

const TRAVEL_TYPES = ['private', 'business', 'commute'];

const StatusCreator = ({
  message,
  onMessageChange,
  onTravelTypeChange,
  travelType,
}: StatusCreatorProps) => {
  const isDesktop = useIsDesktop();

  return (
    <div className={styles.base}>
      <ScrollArea className={styles.scrollArea}>
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
              onChange={(ev) => onMessageChange(ev.target.value)}
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
                onTravelTypeChange(TRAVEL_TYPES.indexOf(value))
              }
              value={TRAVEL_TYPES[travelType]}
            >
              <RadioGroup.Item className={styles.radioItem} value="private">
                <span>Privat</span>
                <IconSkew className={styles.iconSkew} gap="0.25rem" size={5}>
                  <MdOutlineBeachAccess
                    className={styles.iconA}
                    size={isDesktop ? 16 : 18}
                  />
                  <MdOutlineBeachAccess
                    className={styles.iconB}
                    size={isDesktop ? 16 : 18}
                  />
                </IconSkew>
              </RadioGroup.Item>
              <RadioGroup.Item className={styles.radioItem} value="business">
                <span>Beruflich</span>
                <IconSkew className={styles.iconSkew} gap="0.25rem" size={5}>
                  <MdWorkOutline
                    className={styles.iconA}
                    size={isDesktop ? 16 : 18}
                  />
                  <MdWorkOutline
                    className={styles.iconB}
                    size={isDesktop ? 16 : 18}
                  />
                </IconSkew>
              </RadioGroup.Item>
              <RadioGroup.Item className={styles.radioItem} value="commute">
                <span>Pendeln</span>
                <IconSkew className={styles.iconSkew} gap="0.25rem" size={5}>
                  <MdSwapCalls
                    className={styles.iconA}
                    size={isDesktop ? 16 : 18}
                  />
                  <MdSwapCalls
                    className={styles.iconB}
                    size={isDesktop ? 16 : 18}
                  />
                </IconSkew>
              </RadioGroup.Item>
            </RadioGroup.Root>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

export default StatusCreator;
