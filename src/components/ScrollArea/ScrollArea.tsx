import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './ScrollArea.module.scss';
import { ScrollAreaProps } from './types';

const ScrollArea = ({
  children,
  className,
  noFog = false,
}: ScrollAreaProps) => {
  const [contentHeight, setContentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (noFog || !rootRef.current || !viewportRef.current) {
      return;
    }

    const root = rootRef.current;
    const viewport = viewportRef.current;
    const content = viewport.children.item(0)!;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (
          entry.target.hasAttribute('data-viewport') &&
          entry.target.clientHeight !== viewportHeight
        ) {
          setViewportHeight(entry.target.clientHeight);
        } else if (
          !entry.target.hasAttribute('data-viewport') &&
          entry.target.scrollHeight !== contentHeight
        ) {
          setContentHeight(entry.target.scrollHeight);
        }
      }
    });

    const handleScroll = () => {
      if (viewport.scrollTop <= 0) {
        root.style.setProperty('--top-fog-opacity', '0');
      } else if (root.style.getPropertyValue('--top-fog-opacity') !== '1') {
        root.style.setProperty('--top-fog-opacity', '1');
      }

      if (viewport.clientHeight + viewport.scrollTop >= viewport.scrollHeight) {
        root.style.setProperty('--bottom-fog-opacity', '0');
      } else if (root.style.getPropertyValue('--bottom-fog-opacity') !== '1') {
        root.style.setProperty('--bottom-fog-opacity', '1');
      }
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    observer.observe(viewport);
    observer.observe(content);

    return () => {
      viewport.removeEventListener('scroll', handleScroll);
      observer.unobserve(viewport);
      observer.unobserve(content);
    };
  }, [contentHeight, noFog, rootRef, viewportHeight, viewportRef]);

  return (
    <RadixScrollArea.Root
      className={classNames(styles.base, className, {
        [styles.hasFog]: contentHeight > viewportHeight && !noFog,
      })}
      ref={rootRef}
    >
      <RadixScrollArea.Viewport
        className={styles.viewport}
        data-viewport
        ref={viewportRef}
      >
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
