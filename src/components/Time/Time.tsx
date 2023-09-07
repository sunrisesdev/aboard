import { figtree } from '@/styles/fonts';
import clsx from 'clsx';
import { TimeProps } from './types';

const Time = ({ children, className }: TimeProps) => {
  return <span className={clsx(figtree.className, className)}>{children}</span>;
};

export default Time;
