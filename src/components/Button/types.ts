import { ReactNode } from 'react';

type ButtonVariant = 'error' | 'primary' | 'secondary' | 'success';

export type ButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: ButtonVariant;
};
