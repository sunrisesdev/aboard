import { ReactNode } from 'react';

export type NativeSelectProps = {
  children: ReactNode;
  onSelect: (value: string) => void;
  options: ReactNode[];
  value: string;
};
