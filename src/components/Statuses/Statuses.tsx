import { useDashboard } from '@/hooks/useDashboard/useDashboard';
import Image from 'next/image';
import styles from './Statuses.module.scss';

const Statuses = () => {
  const { isLoading, statuses } = useDashboard();

  if (isLoading) return <div>Skeleton...</div>;

  if (typeof statuses === 'undefined' || !statuses)
    return <div>Keine Daten vorhanden</div>;

  return (
    <div className={styles.base}>
      {statuses.map(
        ({ id, username, profilePicture, body, likes, liked, type, train }) => {
          return (
            <div
              key={id}
              className={styles.status}
              style={{
                ['--current-status-color' as any]: `var(--color-${train.category})`,
              }}
            >
              <div>
                <div>{username}</div>
                <div>{train.lineName}</div>

                <div>{body}</div>
                <div>{likes}</div>
                <div>{liked && '❤️'} </div>
              </div>
              <hr className={styles.hr} />

              <div>
                <div>
                  <Image
                    src={profilePicture}
                    loader={({ src }) => src}
                    width={32}
                    height={32}
                    unoptimized
                    className={styles.profilePicture}
                    alt={`Profilbild von ${username}`}
                  />
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default Statuses;
