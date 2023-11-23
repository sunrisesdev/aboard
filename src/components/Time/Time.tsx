import { radioCanada } from '@/styles/fonts';
import clsx from 'clsx';
import styles from './Time.module.scss';
import { TimeProps } from './types';

export const Time = ({ delayStyle, schedule, style, type }: TimeProps) => {
  return (
    <div
      className={clsx(
        radioCanada.className,
        styles.base,
        delayStyle === 'p+a' && styles.vertical
      )}
      style={style}
    >
      {delayStyle !== 'p+a' && type && (
        <span className={styles.type}>{type === 'arrival' ? 'an' : 'ab'}</span>
      )}

      {delayStyle === 'hidden' && <time>{schedule.actual}</time>}

      {delayStyle === 'p+a' && (
        <>
          {!schedule.isOnTime && (
            <s>
              <time>{schedule.planned}</time>
            </s>
          )}
          <time>{schedule.actual}</time>
        </>
      )}

      {delayStyle === 'p+d' && (
        <>
          <time>{schedule.planned}</time>
          {!schedule.isOnTime && (
            <sup className={styles.delay}>
              {schedule.isDelayed && '+'}
              {schedule.delayInMinutes}
            </sup>
          )}
        </>
      )}
    </div>
  );
};
