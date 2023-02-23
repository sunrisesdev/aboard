import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import classNames from 'classnames';
import styles from './ScrollArea.module.scss';
import { ScrollAreaProps } from './types';

const ScrollArea = ({ children, className }: ScrollAreaProps) => {
  return (
    <RadixScrollArea.Root className={classNames(styles.base, className)}>
      <RadixScrollArea.Viewport className={styles.viewport}>
        {children}
      </RadixScrollArea.Viewport>

      <RadixScrollArea.Scrollbar
        className={styles.scrollbar}
        orientation="vertical"
      >
        <RadixScrollArea.Thumb className={styles.thumb} />
      </RadixScrollArea.Scrollbar>
    </RadixScrollArea.Root>
  );
};

export default ScrollArea;
