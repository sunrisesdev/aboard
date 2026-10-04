'use client';

import { Drawer } from '@base-ui/react/drawer';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import type { Extend } from '@/helpers/extend';
import styles from './BottomDrawer.module.css';

const Root = ({
  children,
  className,
  initialFocus,
  nested = false,
  trigger,
  ...props
}: Extend<
  Drawer.Root.Props,
  {
    children?: ReactNode;
    className?: string;
    initialFocus?: Drawer.Popup.Props['initialFocus'];
    // Nested drawers reuse the backdrop of their parent drawer.
    nested?: boolean;
    // Rendered inside Drawer.Root but outside the portal, e.g. a Drawer.Trigger.
    trigger?: ReactNode;
  }
>) => {
  return (
    <Drawer.Root {...props}>
      {trigger}

      <Drawer.VirtualKeyboardProvider>
        <Drawer.Portal>
          {!nested && <Drawer.Backdrop className={styles.backdrop} />}

          <Drawer.Viewport className={styles.viewport}>
            <Drawer.Popup
              className={clsx(styles.popup, className)}
              data-via-snap-points={props.snapPoints?.length ? '' : undefined}
              initialFocus={initialFocus}
            >
              <div aria-hidden className={styles.handle} />

              {children}
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.VirtualKeyboardProvider>
    </Drawer.Root>
  );
};

export const BottomDrawerContent = ({ className, ...props }: Extend<Drawer.Content.Props, { className?: string }>) => {
  return <Drawer.Content className={clsx(styles.content, className)} {...props} />;
};

BottomDrawerContent.displayName = 'BottomDrawer.Content';

export const BottomDrawerFooter = ({ className, ...props }: Extend<'footer'>) => {
  return <footer className={clsx(styles.footer, className)} {...props} />;
};

BottomDrawerFooter.displayName = 'BottomDrawer.Footer';

export const BottomDrawer = Object.assign(Root, {
  Content: BottomDrawerContent,
  displayName: 'BottomDrawer',
  Footer: BottomDrawerFooter,
});
