import CheckIn from '@/components/CheckIn/CheckIn';
import Navbar from '@/components/Navbar/Navbar';
import Statuses from '@/components/Statuses/Statuses';

const DashboardHome = () => {
  return (
    <main>
      <Navbar />

      <Statuses />

      <CheckIn />
    </main>
  );
};

export default DashboardHome;
