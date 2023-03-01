import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';
import SunrisesWordmark from '../../../public/sunrises-wordmark.svg';
import Button from '../Button/Button';
import styles from './Login.module.scss';

const Login = () => {
  return (
    <div className={styles.base}>
      <aside className={styles.keyVisual}>
        <div className={styles.hero}>
          <div className={styles.title}>Willkommen an Bord!</div>
        </div>
      </aside>

      <main className={styles.content}>
        <div className={styles.logo}>Aboard Logo Platzhalter</div>

        <div>
          Aboard ist eine alternative Oberfläche für Träwelling, dem kostenlosen
          Check-in Service, mit dem du deinen Freunden mitteilen kannst, wo du
          gerade mit öffentlichen Verkehrsmitteln unterwegs bist und Fahrtenbuch
          führen kannst.
        </div>

        <Button onClick={() => signIn('traewelling')} variant="primary">
          Anmelden mit Träwelling
        </Button>

        <div>
          Hast du noch keinen Träwelling-Account?
          <br />
          <a href="https://traewelling.de/register">Jetzt registrieren!</a>
        </div>

        <article className={styles.brand}>
          <div className={styles.madeWith}>
            Made with <FaHeart /> by
          </div>
          <Image alt="Sunrises Logo" height={32} src={SunrisesWordmark} />
        </article>

        <footer className={styles.footer}>
          <span>&copy; 2023 Sunrises</span>
          <a href="https://github.com/sunrisesdev/aboard">GitHub</a>
          <Link href="/datenschutz">Datenschutz</Link>
          <Link href="/impressum">Impressum</Link>
        </footer>
      </main>
    </div>
  );
};

export default Login;
