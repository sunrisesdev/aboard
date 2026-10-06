import Link from 'next/link';
import styles from './Navbar.module.css';

export const Navbar = () => {
  return (
    <header className={styles.base}>
      <Link className={styles.logo} href="/dashboard">
        Aboard
      </Link>
    </header>
  );
};
