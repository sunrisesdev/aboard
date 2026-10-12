import { clsx } from 'clsx';
import type { Extend, Structure } from '@/helpers/extend';
import type { StatusResource } from '@/lib/traewelling';
import { getBodyParts } from './getBodyParts';
import styles from './StatusBody.module.css';

export const StatusBody = ({
  body,
  className,
  mentions,
  ...props
}: Extend<Structure, { body: string; mentions: StatusResource['bodyMentions'] }>) => {
  return (
    <div className={clsx(styles.base, className)} {...props}>
      {getBodyParts(body, mentions).map(({ text, username }, index) =>
        username ? (
          <span className={styles.mention} key={index} title={`@${username}`}>
            {text}
          </span>
        ) : (
          text
        ),
      )}
    </div>
  );
};
