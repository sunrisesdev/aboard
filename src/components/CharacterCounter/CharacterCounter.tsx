import { clsx } from 'clsx';
import type { Extend, Structure } from '@/helpers/extend';
import styles from './CharacterCounter.module.css';

export const CharacterCounter = ({
  className,
  count,
  limit,
  ...props
}: Extend<Structure, { count: number; limit: number }>) => {
  const progress = Math.min(count / limit, 1);

  return (
    <div className={clsx(styles.base, className)} data-limit-reached={count >= limit || undefined} {...props}>
      {/* Fills clockwise from twelve o'clock as the limit is approached. */}
      <svg aria-hidden="true" className={styles.ring} viewBox="0 0 16 16">
        <circle className={styles.track} cx="8" cy="8" r="6.5" />
        <circle className={styles.progress} cx="8" cy="8" pathLength={1} r="6.5" strokeDasharray={`${progress} 1`} />
      </svg>

      <span>
        {count}/{limit}
      </span>
    </div>
  );
};
