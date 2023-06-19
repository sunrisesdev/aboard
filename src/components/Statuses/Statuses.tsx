import { useDashboard } from '@/hooks/useDashboard/useDashboard';
import StatusCard from '../StatusCard/StatusCard';
import styles from './Statuses.module.scss';

const Statuses = () => {
  const { isLoading, statuses } = useDashboard();

  if (isLoading) return <div>Skeleton...</div>;

  if (typeof statuses === 'undefined' || !statuses)
    return <div>Keine Daten vorhanden</div>;

  return (
    <div className={styles.base}>
      {statuses.map(
        // ({ id, username, profilePicture, body, likes, liked, type, train }) => {
        //   return (
        //     <div
        //       key={id}
        //       className={styles.status}
        //       style={{
        //         ['--current-status-color' as any]: `var(--color-${train.category})`,
        //       }}
        //     >
        //       <div>
        //         <Link href={`/u/${username}`}>{username}</Link>
        //         <div>{train.lineName}</div>

        //         <div>{body}</div>
        //         <div>{likes}</div>
        //         <div>{liked && '❤️'}</div>
        //         <Link href={`/status/${id}`}>
        //           <div>{id}</div>
        //         </Link>
        //       </div>
        //       <hr className={styles.hr} />

        //       <div>
        //         <div>
        //           <Image
        //             src={profilePicture}
        //             width={32}
        //             height={32}
        //             unoptimized
        //             className={styles.profilePicture}
        //             alt={`Profilbild von ${username}`}
        //           />
        //         </div>
        //       </div>
        //     </div>
        //   );
        // }

        (status) => (
          <StatusCard key={status.id} status={status} />
        )
      )}
    </div>
  );
};

export default Statuses;
