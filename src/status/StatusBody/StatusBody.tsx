import { clsx } from 'clsx';
import Link from 'next/link';
import type { Extend, Structure } from '@/helpers/extend';
import { getUserHref } from '@/helpers/getUserHref';
import type { StatusResource } from '@/lib/traewelling';
import { getBodyParagraphs, getBodyParts } from './getBodyParts';
import styles from './StatusBody.module.css';

const StatusBodyParts = ({ parts }: { parts: ReturnType<typeof getBodyParts> }) =>
  parts.map(({ text, username }, index) =>
    username ? (
      <Link className={styles.mention} href={getUserHref(username)} key={index} title={`@${username}`}>
        {text}
      </Link>
    ) : (
      text
    ),
  );

/**
 * @param paragraphs Splits the body at empty lines into paragraphs, which are spaced by a gap instead.
 */
export const StatusBody = ({
  body,
  className,
  mentions,
  paragraphs = false,
  ...props
}: Extend<Structure, { body: string; mentions: StatusResource['bodyMentions']; paragraphs?: boolean }>) => {
  return (
    <div className={clsx(styles.base, paragraphs && styles.hasParagraphs, className)} {...props}>
      {paragraphs ? (
        getBodyParagraphs(body, mentions).map((parts, index) => (
          <p key={index}>
            <StatusBodyParts parts={parts} />
          </p>
        ))
      ) : (
        <StatusBodyParts parts={getBodyParts(body, mentions)} />
      )}
    </div>
  );
};
