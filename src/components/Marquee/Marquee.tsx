'use client';

import { clsx } from 'clsx';
import { type ReactNode, useEffect, useRef } from 'react';
import styles from './Marquee.module.css';

const pixelsPerSecond = 30;

export const Marquee = ({ children, className }: { children: ReactNode; className?: string }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) {
      return;
    }

    const update = () => {
      const distance = Math.max(0, content.scrollWidth - container.clientWidth);

      container.dataset.viaOverflowing = String(distance > 0);
      container.style.setProperty('--via-marquee-distance', `${distance}px`);
      container.style.setProperty('--via-marquee-duration', `${distance / pixelsPerSecond + 3}s`);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(content);

    return () => observer.disconnect();
  }, []);

  return (
    <span className={clsx(styles.base, className)} ref={containerRef}>
      <span className={styles.content} ref={contentRef}>
        {children}
      </span>
    </span>
  );
};
