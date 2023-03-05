import { NearbyResponse } from '@/traewelling-sdk/functions/trains';
import { debounce } from '@/utils/debounce';
import { useSession } from 'next-auth/react';
import { ChangeEventHandler, MouseEventHandler, useContext } from 'react';
import { MdArrowBack, MdMyLocation, MdSearch } from 'react-icons/md';
import { CheckInContext } from '../CheckIn.context';
import styles from './Search.module.scss';

const Search = () => {
  const { data: session } = useSession();
  const { goBack, isOpen, setIsOpen, setOrigin, setQuery } =
    useContext(CheckInContext);

  const handleBackClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (!isOpen) {
      return;
    }

    event.stopPropagation();
    goBack();
  };

  const handleBaseClick = () => {
    setIsOpen(true);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    debounce(() => setQuery(target.value), 500)();
  };

  const handleNearbyClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (isOpen) {
      event.stopPropagation();
    }

    if (!session) {
      return;
    }

    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const response = await fetch(
        `/api/stations/nearby?latitude=${coords.latitude}&longitude=${coords.longitude}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const station = (await response.json()) as NearbyResponse;
      setOrigin({
        ibnr: station.ibnr,
        name: station.name,
        rilIdentifier: station.rilIdentifier,
      });
    });
  };

  return (
    <div className={styles.base} onClick={handleBaseClick}>
      <button className={styles.leftAddon} onClick={handleBackClick}>
        {isOpen ? <MdArrowBack size={20} /> : <MdSearch size={20} />}
      </button>

      <input
        className={styles.input}
        onChange={handleChange}
        placeholder="Wo bist du?"
      />

      <button className={styles.rightAddon} onClick={handleNearbyClick}>
        <MdMyLocation size={20} />
      </button>
    </div>
  );
};

export default Search;
