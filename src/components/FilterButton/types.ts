import { ReactNode } from 'react';

export type FilterButtonProps = {
  children: ReactNode;
  className?: string;
  isActive: boolean;
  onClick: (value: any) => void;
  value: any;
};
