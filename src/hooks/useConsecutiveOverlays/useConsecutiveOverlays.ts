import { OverlayProps } from '@/components/Overlay/types';
import { useState } from 'react';
import { ConsecutiveOverlays } from './types';

export const useConsecutiveOverlays = <T extends string>(
  order: readonly T[]
) => {
  if (!order.length) throw TypeError('`order` contains no elements');

  const [isActive, setActive] = useState(false);
  const [current, setCurrent] = useState<T>(order[0]);
  const [last, setLast] = useState<T | undefined>();

  const currentIndex = order.indexOf(current);

  const next = () => {
    if (currentIndex === order.length - 1) {
      return;
    }

    setLast(current);
    setCurrent(order[currentIndex + 1]);
    setTimeout(() => setLast(undefined), 200);
  };

  const previous = () => {
    if (currentIndex === 0) {
      return;
    }

    setLast(current);
    setCurrent(order[currentIndex - 1]);
    setTimeout(() => setLast(undefined), 200);
  };

  return {
    ...(order.reduce((props, overlay, overlayIndex) => {
      return {
        ...props,
        [`${overlay}Props`]: {
          isActive: isActive && overlayIndex <= currentIndex,
          isHidden: currentIndex > overlayIndex && last !== overlay,
          onClose: overlayIndex === 0 ? undefined : previous,
          withBackdrop: currentIndex <= overlayIndex,
        } satisfies OverlayProps,
      };
    }, {}) as ConsecutiveOverlays<T>),
    next,
    setActive,
  };
};
