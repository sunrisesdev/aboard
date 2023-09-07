import { ReactNode } from 'react';

type ButtonVariant = 'error' | 'primary' | 'success';

export type ButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: ButtonVariant;
};
