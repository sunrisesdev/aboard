import clsx from 'clsx';
import { motion } from 'framer-motion';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TbX } from 'react-icons/tb';
import Sheet, { SheetRef } from 'react-modal-sheet';
import styles from './Overlay.module.scss';
import { OverlayRootProps } from './types';

const SHEET_HEADER_HEIGHT = 40;

const OverlayContext = createContext({
  isExpanded: false,
});

const OverlayRoot = ({
  children,
  className,
  isActive,
  isHidden = false,
  onBackdropTap,
  onClose,
  style,
  withBackdrop,
}: OverlayRootProps) => {
  const [backdropStyle, setBackdropStyle] = useState<
    'clear' | 'partial' | 'full'
  >('clear');
  const [isExpanded, setExpanded] = useState(false);
  const ref = useRef<SheetRef>();

  const handleOnSnap = (index: number) => {
    setBackdropStyle((['full', 'partial', 'clear'] as const)[index]);
    setExpanded(index === 0);
  };

  useEffect(() => {
    if (isHidden) {
      ref.current?.snapTo(3);
    } else {
      ref.current?.snapTo(1);
    }
  }, [isHidden]);

  return (
    <Sheet
      initialSnap={isHidden ? 3 : 1}
      isOpen={isActive}
      onClose={() => !isHidden && ref.current?.snapTo(2)}
      onSnap={handleOnSnap}
      ref={ref}
      snapPoints={[
        -16,
        1 / 3,
        SHEET_HEADER_HEIGHT + 34,
        ...(isHidden ? [0] : []),
      ]}
    >
      <Sheet.Container className={clsx(styles.base, className)} style={style}>
        <Sheet.Header />

        {onClose && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            <TbX />
          </button>
        )}

        <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
          <OverlayContext.Provider value={{ isExpanded }}>
            {children}
          </OverlayContext.Provider>
        </Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop
        className={styles.backdropContainer}
        onTap={onBackdropTap || (onClose ? () => void 0 : undefined)}
      >
        <motion.div
          animate={{
            opacity: backdropStyle === 'clear' || !withBackdrop ? 0 : 1,
          }}
          className={styles.backdrop}
          style={{
            height: ref.current?.y,
          }}
        />
      </Sheet.Backdrop>
    </Sheet>
  );
};

const OverlayScrollArea = ({ children }: PropsWithChildren) => {
  const { isExpanded } = useContext(OverlayContext);
  const isScrollDisabled = !isExpanded;

  const [contentHeight, setContentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const scrollerRef = useRef<HTMLElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScrollDisabled) {
      scrollerRef.current?.scrollTo({ behavior: 'smooth', top: 0 });
    }
  }, [isScrollDisabled]);

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

  return (
    <div
      className={clsx(
        styles.scrollWrapper,
        contentHeight > viewportHeight && styles.hasFog
      )}
      ref={wrapperRef}
    >
      <Sheet.Scroller
        className={styles.scrollContainer}
        draggableAt="top"
        ref={scrollerRef}
        style={{
          overflowX: 'hidden',
          overflowY: isScrollDisabled ? 'hidden' : 'unset',
        }}
      >
        {children}
      </Sheet.Scroller>
    </div>
  );
};

export const Overlay = Object.assign(OverlayRoot, {
  ScrollArea: OverlayScrollArea,
});
