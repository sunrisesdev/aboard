import { ReactNode } from 'react';

type ButtonVariant = 'error' | 'primary' | 'success';

export type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  variant?: ButtonVariant;
};
