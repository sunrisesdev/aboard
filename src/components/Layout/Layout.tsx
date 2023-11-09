import { PropsWithChildren } from 'react';
import styles from './Layout.module.scss';

const Layout = ({ children }: PropsWithChildren) => {
  return <div className={styles.base}>{children}</div>;
};

export default Layout;
