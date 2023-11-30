import { figtree } from '@/styles/fonts';
import clsx from 'clsx';
import { LegacyTimeProps } from './types';

const LegacyTime = ({ children, className }: LegacyTimeProps) => {
  return <span className={clsx(figtree.className, className)}>{children}</span>;
};

export default LegacyTime;
