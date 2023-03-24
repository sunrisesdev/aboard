'use client';

import { PropsWithChildren } from 'react';
import { useAccentColor } from './useAccentColor';

const AccentColorLayout = ({ children }: PropsWithChildren) => {
  const color = useAccentColor();

  const style = {
    '--accent-color': color,
  } as React.CSSProperties;

  return <main style={style}>{children}</main>;
};

export default AccentColorLayout;
