import type { Metadata } from 'next';
import { PageContent } from '@/components/PageContent/PageContent';
import styles from './page.module.css';

// Draft: every "[TODO: …]" still has to be filled in or verified before going live.

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
};

export default function PrivacyPolicyPage() {
  return (
    <PageContent>
      <main className={styles.base}>
        <header>
          <h1>Datenschutzerklärung</h1>
          <p className={styles.meta}>Stand: [TODO: Datum]</p>
        </header>

        <section>
          <h2>1. Verantwortlicher</h2>
          <p>
            [TODO: Name]
            <br />
            [TODO: Straße und Hausnummer]
            <br />
            [TODO: PLZ und Ort]
            <br />
            E-Mail: [TODO: E-Mail-Adresse]
          </p>
        </section>

        <section>
          <h2>2. Überblick</h2>
          <p>
            Aboard ist ein inoffizieller Client für Träwelling. Aboard betreibt keine eigene Datenbank mit Nutzerdaten:
            Deine Daten werden bei Bedarf über die Schnittstelle von Träwelling abgerufen bzw. an diese übermittelt. Im
            Folgenden erfährst du, welche Daten dabei verarbeitet werden.
          </p>
        </section>

        <section>
          <h2>3. Hosting und Server-Logfiles</h2>
          <p>
            Diese Website wird bei [TODO: Hoster, z. B. Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA]
            gehostet. Beim Aufruf der Website werden automatisch folgende Daten verarbeitet:
          </p>
          <ul>
            <li>IP-Adresse</li>
            <li>Datum und Uhrzeit der Anfrage</li>
            <li>aufgerufene Seite bzw. Datei</li>
            <li>Referrer-URL</li>
            <li>Browser und Betriebssystem (User-Agent)</li>
          </ul>
          <p>
            Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in
            der sicheren und stabilen Bereitstellung der Website. Die Logfiles werden nach [TODO: Speicherdauer]
            gelöscht.
          </p>
          <p>
            [TODO: Drittlandübermittlung prüfen und beschreiben, z. B.: „Der Hoster ist unter dem EU-US Data Privacy
            Framework zertifiziert. Mit dem Hoster wurde ein Vertrag zur Auftragsverarbeitung geschlossen.“]
          </p>
        </section>

        <section>
          <h2>4. Anmeldung über Träwelling</h2>
          <p>
            Die Anmeldung erfolgt über deinen Träwelling-Account (OAuth). Dabei erhält Aboard nach deiner Zustimmung ein
            Zugriffstoken, mit dem Aboard in deinem Namen auf Träwelling zugreifen darf, z. B. um Abfahrten anzuzeigen,
            Check-ins zu erstellen oder Statusmeldungen zu lesen.
          </p>
          <p>
            Das Zugriffstoken und deine Profildaten (z. B. Anzeigename, Benutzername und Profilbild) werden
            verschlüsselt in einem Cookie in deinem Browser gespeichert, nicht auf unseren Servern. Für die Anmeldung
            wirst du zu Träwelling weitergeleitet, sodass Träwelling dabei deine IP-Adresse erhält. Alle weiteren
            Anfragen an Träwelling stellt unser Server in deinem Namen; Träwelling erhält dabei die Inhalte deiner
            Anfrage (z. B. gesuchte Stationen oder Check-in-Daten), nicht aber deine IP-Adresse.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, da die Verarbeitung für die Nutzung von Aboard erforderlich
            ist. Für die Verarbeitung durch Träwelling gilt dessen Datenschutzerklärung: [TODO: Link zur
            Datenschutzerklärung von Träwelling].
          </p>
        </section>

        <section>
          <h2>5. Cookies</h2>
          <p>
            Aboard verwendet ausschließlich technisch notwendige Cookies, um dich angemeldet zu halten und die Anmeldung
            abzusichern (Sitzung, Schutz vor Cross-Site-Request-Forgery, Weiterleitung nach der Anmeldung). Diese
            Cookies sind für den Betrieb erforderlich und benötigen daher keine Einwilligung (§ 25 Abs. 2 Nr. 2 TDDDG).
            Das Sitzungs-Cookie wird gelöscht, wenn du dich abmeldest, spätestens aber nach [TODO: Gültigkeitsdauer der
            Sitzung].
          </p>
        </section>

        <section>
          <h2>6. Kartendarstellung (OpenFreeMap)</h2>
          <p>
            Zur Darstellung des Fahrtverlaufs verwenden wir Kartendaten von OpenFreeMap ([TODO: Betreiber und Anschrift
            von OpenFreeMap]), basierend auf Daten von OpenStreetMap und OpenMapTiles. Die Karte wird erst geladen,
            nachdem du auf „Karte laden“ geklickt hast.
          </p>
          <p>
            Beim Laden der Karte ruft dein Browser die Kartendaten direkt von den Servern von OpenFreeMap ab. Dabei
            werden insbesondere deine IP-Adresse, der User-Agent deines Browsers und die aufrufende Website an
            OpenFreeMap übertragen. Die Kartendaten werden über das Content Delivery Network von Cloudflare
            ausgeliefert, sodass eine Übermittlung in die USA nicht ausgeschlossen werden kann. [TODO: prüfen]
          </p>
          <p>
            Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die du durch den Klick auf „Karte
            laden“ erteilst. Du kannst sie jederzeit für die Zukunft widerrufen, indem du die Karte nicht erneut lädst.
            Weitere Informationen: [TODO: Link zur Datenschutzerklärung bzw. den Nutzungsbedingungen von OpenFreeMap].
          </p>
        </section>

        <section>
          <h2>7. Schriftarten</h2>
          <p>
            Die verwendeten Schriftarten werden von unserem eigenen Server ausgeliefert. Es findet keine Verbindung zu
            Servern von Google oder anderen Anbietern statt.
          </p>
        </section>

        <section>
          <h2>8. Deine Rechte</h2>
          <p>Du hast im Rahmen der gesetzlichen Bestimmungen jederzeit das Recht auf:</p>
          <ul>
            <li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO)</li>
            <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
          <p>
            Außerdem hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren, z. B. bei [TODO:
            zuständige Aufsichtsbehörde].
          </p>
        </section>
      </main>
    </PageContent>
  );
}
