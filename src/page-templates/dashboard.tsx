import CheckIn from '@/components/CheckIn/CheckIn';
import Navbar from '@/components/Navbar/Navbar';
import Statuses from '@/components/Statuses/Statuses';
import Link from 'next/link';
import styles from './dashboard.module.scss';

const DashboardHome = () => {
  return (
    <main>
      <Navbar />

      <Statuses />

      <CheckIn />

      <div className={styles.legal}>
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
      </div>
    </main>
  );
};

export default DashboardHome;
