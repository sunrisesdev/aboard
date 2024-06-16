import useUmami from '@/hooks/useUmami/useUmami';
import { NearbyResponse } from '@/traewelling-sdk/functions/trains';
import { debounce } from '@/utils/debounce';
import clsx from 'clsx';
import {
  ChangeEventHandler,
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { MdArrowBack, MdMyLocation, MdSearch } from 'react-icons/md';
import { CheckInContext } from '../CheckIn.context';
import styles from './Search.module.scss';

const Search = () => {
  const { goBack, isOpen, setIsOpen, setOrigin, setQuery } =
    useContext(CheckInContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const { simpleEvent } = useUmami();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

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

    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const response = await fetch(
        `/traewelling/stations/nearby?latitude=${coords.latitude}&longitude=${coords.longitude}`
      );

      if (!response.ok) {
        return;
      }

      simpleEvent('nearby_clicked');

      const station = (await response.json()) as NearbyResponse;
      setOrigin({
        id: station.id,
        ibnr: station.ibnr,
        name: station.name,
        rilIdentifier: station.rilIdentifier,
      });
    });
  };

  return (
    <div
      className={clsx(styles.base, !isOpen && styles.isAttached)}
      onClick={handleBaseClick}
    >
      <button className={styles.leftAddon} onClick={handleBackClick}>
        {isOpen ? <MdArrowBack size={20} /> : <MdSearch size={20} />}
      </button>

      <input
        className={styles.input}
        onChange={handleChange}
        placeholder="Wo bist du?"
        ref={inputRef}
      />

      <button className={styles.rightAddon} onClick={handleNearbyClick}>
        <MdMyLocation size={20} />
      </button>
    </div>
  );
};

export default Search;
