import { useEffect, useRef, useState } from 'react';
import { UseOverlayScrollProps } from './types';

export const useOverlayScroll = ({ disableScroll }: UseOverlayScrollProps) => {
  const [contentHeight, setContentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const scrollerRef = useRef<HTMLElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disableScroll)
      scrollerRef.current?.scrollTo({ behavior: 'smooth', top: 0 });
  }, [disableScroll]);

  useEffect(() => {
    if (!scrollerRef.current || !wrapperRef.current) {
      return;
    }

    const root = wrapperRef.current;
    const viewport = scrollerRef.current;
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
  }, [contentHeight, scrollerRef, viewportHeight, wrapperRef]);

  return {
    contentHeight,
    scrollerRef,
    viewportHeight,
    wrapperRef,
  };
};
