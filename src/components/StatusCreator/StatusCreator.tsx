import useIsDesktop from '@/hooks/useIsDesktop/useIsDesktop';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { MdOutlineWorkOff, MdWorkOutline } from 'react-icons/md';
import { RiRouteLine } from 'react-icons/ri';
import IconSkew from '../IconSkew/IconSkew';
import ScrollArea from '../ScrollArea/ScrollArea';
import styles from './StatusCreator.module.scss';
import { StatusCreatorProps } from './types';

const StatusCreator = ({ message, onMessageChange }: StatusCreatorProps) => {
  const isDesktop = useIsDesktop();

  return (
    <div className={styles.base}>
      <ScrollArea className={styles.scrollArea}>
        <div className={styles.content}>
          <article>
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
          </article>

          <RadioGroup.Root className={styles.radioGroup} defaultValue="private">
            <RadioGroup.Item className={styles.radioItem} value="private">
              <span>Privat</span>

              <IconSkew className={styles.iconSkew} gap="0.25rem" size={5}>
                <MdOutlineWorkOff
                  className={styles.iconA}
                  size={isDesktop ? 16 : 18}
                />
                <MdOutlineWorkOff
                  className={styles.iconB}
                  size={isDesktop ? 16 : 18}
                />
              </IconSkew>
            </RadioGroup.Item>
            <RadioGroup.Item className={styles.radioItem} value="business">
              <span>Geschäftlich</span>

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
                <RiRouteLine
                  className={styles.iconA}
                  size={isDesktop ? 16 : 18}
                />
                <RiRouteLine
                  className={styles.iconB}
                  size={isDesktop ? 16 : 18}
                />
              </IconSkew>
            </RadioGroup.Item>
          </RadioGroup.Root>
        </div>
      </ScrollArea>
    </div>
  );
};

export default StatusCreator;
