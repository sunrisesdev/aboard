'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Shimmer from '../Shimmer/Shimmer';
import styles from './ProfileImage.module.scss';

const ProfileImage = () => {
  const { data: session } = useSession();

  if (!session?.user.image)
    return (
      <div className={styles.wrapper}>
        <Shimmer height={'2rem'} width={'2rem'} className={styles.base} />
      </div>
    );

  return (
    <div className={styles.wrapper} onClick={() => signOut()}>
      <Image
        src={session.user.image}
        alt={session.user.name}
        width={32}
        height={32}
        className={styles.base}
      />
    </div>
  );
};

export default ProfileImage;
