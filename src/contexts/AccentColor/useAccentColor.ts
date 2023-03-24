import { useContext } from 'react';
import { AccentColorContext } from './AccentColor.context';

export const useAccentColor = () => {
  const accentColor = useContext(AccentColorContext);

  if (accentColor === undefined) {
    throw new Error('useAccentColor must be used within a AccentColorProvider');
  }

  return accentColor;
};
