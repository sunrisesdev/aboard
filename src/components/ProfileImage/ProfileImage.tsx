'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Shimmer from '../Shimmer/Shimmer';
import styles from './ProfileImage.module.scss';

const ProfileImage = () => {
  const { data: session } = useSession();

  if (!session?.user.image)
    return (
      <div className={styles.wrapper}>
        <Shimmer height={'2.5rem'} width={'2.5rem'} className={styles.base} />
      </div>
    );

  return (
    <div className={styles.wrapper}>
      <Image
        src={session.user.image}
        alt={session.user.name}
        width={40}
        height={40}
        className={styles.base}
      />
    </div>
  );
};

export default ProfileImage;
