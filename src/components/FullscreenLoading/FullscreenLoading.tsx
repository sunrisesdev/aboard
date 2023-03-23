import LockBodyScroll from '../LockBodyScroll/LockBodyScroll';
import styles from './FullscreenLoading.module.scss';

const FullscreenLoading = () => {
  return (
    <>
      <div className={styles.base}>
        <div className={styles.spinner} />
      </div>
      <LockBodyScroll />
    </>
  );
};

export default FullscreenLoading;
