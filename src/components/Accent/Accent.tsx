import { CSSProperties } from 'react';
import styles from './Accent.module.scss';
import { AccentProps } from './types';

const Accent = ({ children, color }: AccentProps) => {
  const style = { ['--accent']: color } as CSSProperties;

  return (
    <div className={styles.base} style={style}>
      {children}
    </div>
  );
};

export default Accent;
