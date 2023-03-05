import { debounce } from '@/utils/debounce';
import {
  ChangeEventHandler,
  MouseEventHandler,
  useContext,
  useState,
} from 'react';
import { MdArrowBack, MdMyLocation, MdSearch } from 'react-icons/md';
import { CheckInContext } from '../CheckIn.context';
import styles from './Search.module.scss';

const Search = () => {
  const { goBack, isOpen, query, setIsOpen, setQuery } =
    useContext(CheckInContext);
  const [value, setValue] = useState('');

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
    setValue(target.value);

    debounce(() => setQuery(target.value), 500)();
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

      <button className={styles.rightAddon}>
        <MdMyLocation size={20} />
      </button>
    </div>
  );
};

export default Search;
