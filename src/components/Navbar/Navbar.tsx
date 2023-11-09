import Notifications from '../Notifications/Notifications';
import ProfileDrawer from '../ProfileDrawer/ProfileDrawer';
import ProfileImage from '../ProfileImage/ProfileImage';
import styles from './Navbar.module.scss';
import Username from './Username';

const getCurrentGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) return 'Guten Morgen 🌞';

  if (currentHour >= 12 && currentHour < 18) return 'Guten Tag 🌤️';

  if (currentHour >= 18 && currentHour < 22) return 'Guten Abend 🌙';

  return 'Gute Nacht 🌑';
};

const Navbar = () => {
  return (
    <nav className={styles.base}>
      <div className={styles.text}>
        <div className={styles.greeting}>{getCurrentGreeting()}</div>
        <div className={styles.username}>
          <Username />
        </div>
      </div>
      <div className={styles.items}>
        <Notifications />
        <ProfileDrawer>
          <ProfileImage />
        </ProfileDrawer>
      </div>
    </nav>
  );
};

export default Navbar;
