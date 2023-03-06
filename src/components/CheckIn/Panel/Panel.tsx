import clsx from 'clsx';
import { useContext } from 'react';
import { CheckInContext } from '../CheckIn.context';
import styles from './Panel.module.scss';
import { PanelProps } from './types';

const Panel = ({ children }: PanelProps) => {
  const { isOpen } = useContext(CheckInContext);

  return (
    <div className={clsx(styles.base, { [styles.isOpen]: isOpen })}>
      {children}
    </div>
  );
};

export default Panel;
