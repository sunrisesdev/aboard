import { ReactNode } from 'react';

type ButtonVariant = 'primary';

export type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  variant?: ButtonVariant;
};
