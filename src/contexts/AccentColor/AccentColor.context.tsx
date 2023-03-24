'use client';

import { createContext } from 'react';
import AccentColorLayout from './AccentColorLayout';

export const AccentColorContext = createContext<
  React.CSSProperties['color'] | undefined
>(undefined);

const AccentColorProvider = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color: React.CSSProperties['color'];
}) => {
  return (
    <AccentColorContext.Provider value={color}>
      <AccentColorLayout>{children}</AccentColorLayout>
    </AccentColorContext.Provider>
  );
};

export default AccentColorProvider;
