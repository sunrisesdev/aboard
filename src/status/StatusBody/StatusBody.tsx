import { clsx } from 'clsx';
import Link from 'next/link';
import type { Extend, Structure } from '@/helpers/extend';
import { getUserHref } from '@/helpers/getUserHref';
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
          <Link className={styles.mention} href={getUserHref(username)} key={index} title={`@${username}`}>
            {text}
          </Link>
        ) : (
          text
        ),
      )}
    </div>
  );
};
