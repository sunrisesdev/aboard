import { getWhiteLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import { parseSchedule } from '@/utils/parseSchedule';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCT_ICONS } from '../CheckIn/consts';
import LineIndicator from '../LineIndicator/LineIndicator';
import Shimmer from '../Shimmer/Shimmer';
import ThemeProvider from '../ThemeProvider/ThemeProvider';
import Time from '../Time/Time';
import styles from './StatusCard.module.scss';
import { StatusCardProps } from './types';

import clsx from 'clsx';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

const StatusCard = ({ status }: StatusCardProps) => {
  const hasArrived =
    new Date(
      status.train.destination.arrival ??
        status.train.destination.arrivalReal ??
        ''
    ).getTime() <= Date.now();

  const arrivalSchedule = parseSchedule({
    actual:
      status.train.destination.arrivalReal ??
      status.train.destination.arrival ??
      '',
    planned: status.train.destination.arrivalPlanned ?? '',
  });

  const departureSchedule = parseSchedule({
    actual:
      status.train.origin.departureReal ?? status.train.origin.departure ?? '',
    planned: status.train.origin.departurePlanned ?? '',
  });

  const travelTime =
    arrivalSchedule.actualValue - departureSchedule.actualValue;
  const timePassed = Date.now() - departureSchedule.actualValue;
  const progress = Math.max(0, Math.min(timePassed * (100 / travelTime), 100));

  const isLiked = status.liked;

  const handleLike = async () => {
    await fetch(`/traewelling/statuses/${status.id}/like`, {
      method: isLiked ? 'DELETE' : 'POST',
    });
  };

  return (
    <ThemeProvider
      theme={getWhiteLineTheme(status.train.number, status.train.category)}
    >
      <div>
        <article className={styles.base}>
          <header className={styles.header}>
            <Image
              alt={`Profilbild von ${status.username}`}
              className={styles.avatar}
              height={32}
              src={status.profilePicture}
              style={{ flexShrink: 0 }}
              unoptimized
              width={32}
            />

            <div>
              <div className={styles.username}>{status.username}</div>
            </div>

            <div className={styles.icons}>
              {PRODUCT_ICONS[status.train.category]({
                className: styles.productIcon,
              })}

              <div className={styles.heart} onClick={handleLike}>
                {isLiked ? (
                  <AiFillHeart className={styles.heartFilled} />
                ) : (
                  <AiOutlineHeart />
                )}

                <span className={styles.amount}>{status.likes}</span>
              </div>
            </div>
          </header>

          <header className={styles.origin}>
            <div className={styles.stop} />

            <div>{status.train.origin.name}</div>

            <Time className={styles.time}>{departureSchedule.actual}</Time>
          </header>

          <Link
            className={clsx(styles.link, styles.destination)}
            href={`/status/${status.id}`}
          >
            <div className={styles.station}>
              {status.train.destination.name}
            </div>

            <div className={styles.footer}>
              <LineIndicator
                className={styles.lineIndicator}
                lineId={status.train.number}
                lineName={status.train.lineName}
                product={status.train.category}
                productName=""
              />

              <div className={styles.line}>
                <svg
                  className={styles.partial}
                  height={20}
                  version="1.1"
                  width="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    strokeDasharray="0.1 6"
                    x1={0}
                    y1={10}
                    x2="100%"
                    y2={10}
                    stroke="rgba(var(--contrast-rgb, 255, 255, 255), 0.5)"
                    strokeWidth="2px"
                    strokeLinecap="round"
                  />
                </svg>
                <div
                  className={styles.progress}
                  style={{ width: `${progress}%` }}
                />
                {/* {!hasArrived && (
                  <FaCaretRight
                    color="var(--contrast)"
                    style={{ marginLeft: '-6px' }}
                  />
                )} */}
              </div>

              <div className={styles.stop} />

              <Time className={styles.time}>{arrivalSchedule.actual}</Time>
            </div>
          </Link>
        </article>
      </div>
    </ThemeProvider>
  );
};

const StatusCardSkeleton = () => {
  const getWidth = () => Math.random() * (85 - 50) + 50;

  return (
    <ThemeProvider
      color="#FFF"
      colorRGB="255, 255, 255"
      contrast="#DDDBDD"
      contrastRGB="221, 219, 221"
    >
      <article className={styles.base}>
        <header className={styles.header}>
          <Shimmer
            height="2rem"
            style={{ borderRadius: '9999rem' }}
            width="2rem"
          />

          <Shimmer className={styles.username} width={`${getWidth() / 2}%`} />

          <div className={styles.icons}>
            <Shimmer height="1.25rem" width="1.25rem" />
            <Shimmer height="1.25rem" width="1.25rem" />
          </div>
        </header>

        <header className={styles.origin}>
          <div className={styles.stop} />

          <Shimmer height="1.5rem" width={`${getWidth() / 1.5}%`} />

          <Shimmer className={styles.time} width="2rem" />
        </header>

        <section className={styles.destination}>
          <Shimmer
            className={styles.station}
            height="1.5rem"
            style={{ marginInline: '1rem' }}
            width={`${getWidth() / 1.5}%`}
          />

          <div className={styles.footer}>
            <Shimmer
              className={styles.lineIndicator}
              height="1.25rem"
              width="3rem"
            />

            <div className={styles.line}>
              <svg
                className={styles.partial}
                height={20}
                version="1.1"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  strokeDasharray="0.1 6"
                  x1={0}
                  y1={10}
                  x2="100%"
                  y2={10}
                  stroke="rgba(var(--contrast-rgb, 255, 255, 255), 0.5)"
                  strokeWidth="2px"
                  strokeLinecap="round"
                />
              </svg>

              <Shimmer
                className={styles.progress}
                height="2px"
                width={`${getWidth()}%`}
              />
            </div>

            <div className={styles.stop} />

            <Shimmer className={styles.time} width="2rem" />
          </div>
        </section>
      </article>
    </ThemeProvider>
  );
};

export default Object.assign(StatusCard, {
  Skeleton: StatusCardSkeleton,
});
