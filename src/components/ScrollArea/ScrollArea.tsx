import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import styles from './ScrollArea.module.scss';
import { ScrollAreaProps } from './types';

const ScrollArea = ({
  children,
  className,
  noFog = false,
  topFogBorderRadius,
}: ScrollAreaProps) => {
  const [contentHeight, setContentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // const [isPullingDown, setIsPullingDown] = useState(false);
  // const [topOverscroll, setTopOverscroll] = useState(0);

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

      // viewport.scrollTop < 0
      //   ? setTopOverscroll(0 - viewport.scrollTop)
      //   : setTopOverscroll(0);

      // const threshold = 96;

      // if (viewport.scrollTop <= -threshold) {
      //   setIsPullingDown(true);
      // }

      // if (
      //   viewport.scrollTop > -threshold &&
      //   viewport.scrollTop + viewport.clientHeight <
      //     viewport.scrollHeight + threshold
      // ) {
      //   setIsPullingDown(false);
      // }

      // if (
      //   viewport.scrollTop + viewport.clientHeight >=
      //   viewport.scrollHeight + threshold
      // ) {
      //   viewport.style.background = 'green';
      // }
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
      className={clsx(styles.base, className, {
        [styles.hasFog]: contentHeight > viewportHeight && !noFog,
      })}
      ref={rootRef}
      style={{ ['--top-fog-border-radius' as any]: topFogBorderRadius }}
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
