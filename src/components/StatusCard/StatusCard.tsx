import { parseSchedule } from '@/utils/parseSchedule';
import colorConvert from 'color-convert';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { METHOD_ICONS } from '../CheckIn/consts';
import LegacyTime from '../LegacyTime/LegacyTime';
import { NewLineIndicator } from '../NewLineIndicator/NewLineIndicator';
import Shimmer from '../Shimmer/Shimmer';
import ThemeProvider from '../ThemeProvider/ThemeProvider';
import styles from './StatusCard.module.scss';
import { StatusCardProps } from './types';

const StatusCard = ({ status }: StatusCardProps) => {
  const [hasLiked, setHasLiked] = useState(status.likedByMe ?? false);
  const [likes, setLikes] = useState(status.likeCount);

  const accentRGB =
    status.journey.line.appearance.accentColor &&
    colorConvert.hex
      .rgb(status.journey.line.appearance.accentColor!)
      .join(', ');

  const arrivalSchedule = parseSchedule({
    actual:
      status.journey.manualArrival ??
      status.journey.destination.arrival.actual ??
      '',
    planned: status.journey.destination.arrival.planned ?? '',
  });

  const departureSchedule = parseSchedule({
    actual:
      status.journey.manualDeparture ??
      status.journey.origin.departure.actual ??
      '',
    planned: status.journey.origin.departure.planned ?? '',
  });

  const travelTime =
    arrivalSchedule.actualValue - departureSchedule.actualValue;
  const timePassed = Date.now() - departureSchedule.actualValue;
  const progress = Math.max(0, Math.min(timePassed * (100 / travelTime), 100));

  const handleLike = async () => {
    const isLiked = hasLiked;
    const initialLikes = likes;

    try {
      setHasLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);

      await fetch(`/traewelling/statuses/${status.id}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      });
    } catch (error) {
      setHasLiked(isLiked);
      setLikes(initialLikes);

      toast.error(
        'Fehler beim Liken des Statuses. Bitte versuchen Sie es erneut.'
      );

      console.log('Failed to like status:', error);
    }
  };

  const [accentH, accentS, accentL] = colorConvert.hex.hsl(
    status.journey.line.appearance.accentColor!
  );
  const safeAccentColor = `#${colorConvert.hsl.hex([
    accentH,
    accentS,
    Math.min(accentL, 25),
  ])}`;

  return (
    <ThemeProvider
      color="#FFFFFF"
      colorRGB="255, 255, 255"
      contrast={status.journey.line.appearance.accentColor}
      contrastRGB={accentRGB}
    >
      <div
        style={{
          ['--safe-accent' as any]: safeAccentColor,
          ['--safe-contrast' as any]:
            status.journey.line.appearance.contrastColor,
        }}
      >
        <article className={styles.base}>
          <header className={styles.header}>
            <Image
              alt={`Profilbild von ${status.username}`}
              className={styles.avatar}
              height={32}
              src={status.userAvatarUrl}
              style={{ flexShrink: 0 }}
              unoptimized
              width={32}
            />

            <div>
              <div className={styles.username}>{status.username}</div>
            </div>

            <div className={styles.icons}>
              {METHOD_ICONS[status.journey.line.method]({
                className: styles.productIcon,
              })}

              <div className={styles.heart} onClick={handleLike}>
                {hasLiked ? (
                  <AiFillHeart className={styles.heartFilled} />
                ) : (
                  <AiOutlineHeart />
                )}

                <span className={styles.amount}>{likes}</span>
              </div>
            </div>
          </header>

          <header className={styles.origin}>
            <div className={styles.stop} />

            <div>{status.journey.origin.station.name}</div>

            <LegacyTime className={styles.time}>
              {departureSchedule.actual}
            </LegacyTime>
          </header>

          <Link className={styles.link} href={`/status/${status.id}`}>
            {status.message && (
              <div className={styles.message}>
                <span>{status.message}</span>
              </div>
            )}

            <div className={styles.destination}>
              <div className={styles.station}>
                {status.journey.destination.station.name}
              </div>

              <div className={styles.footer}>
                {/* <LineIndicator
                  className={styles.lineIndicator}
                  lineId={status.train.number}
                  lineName={status.train.lineName}
                  product={status.train.category}
                /> */}

                <NewLineIndicator line={status.journey.line} noOutline />

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
                </div>

                <div className={styles.stop} />

                <LegacyTime className={styles.time}>
                  {arrivalSchedule.actual}
                </LegacyTime>
              </div>
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
