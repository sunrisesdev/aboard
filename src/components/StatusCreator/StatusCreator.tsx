import styles from './StatusCreator.module.scss';
import { StatusCreatorProps } from './types';

const StatusCreator = ({ message, onMessageChange }: StatusCreatorProps) => {
  return (
    <div className={styles.base}>
      <textarea
        className={styles.textarea}
        maxLength={280}
        onChange={(ev) => onMessageChange(ev.target.value)}
        value={message}
      />
      <div className={styles.characterLimit}>{message.length}/280</div>
    </div>
  );
};

export default StatusCreator;
