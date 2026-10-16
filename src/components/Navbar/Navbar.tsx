import Link from 'next/link';
import { StationSearchAutocomplete } from '@/station/StationSearchAutocomplete/StationSearchAutocomplete';
import styles from './Navbar.module.css';

export const Navbar = () => {
  return (
    <header className={styles.base}>
      <div className={styles.content}>
        <Link className={styles.logo} href="/dashboard">
          Aboard
        </Link>

        <StationSearchAutocomplete className={styles.search} />
      </div>
    </header>
  );
};
