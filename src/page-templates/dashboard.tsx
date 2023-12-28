import CheckIn from '@/components/CheckIn/CheckIn';
import Navbar from '@/components/Navbar/Navbar';
import { NewCheckInTrigger } from '@/components/NewCheckInTrigger/NewCheckInTrigger';
import Statuses from '@/components/Statuses/Statuses';
import Link from 'next/link';
import styles from './dashboard.module.scss';

const DashboardHome = () => {
  return (
    <main>
      <Navbar />

      <Statuses />

      <CheckIn />

      <NewCheckInTrigger />

      <div className={styles.legal}>
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
      </div>
    </main>
  );
};

export default DashboardHome;
