import { inter } from '@/styles/fonts';
import clsx from 'clsx';
import styles from './LineIndicator.module.scss';
import { LineIndicatorProps } from './types';

const HIDDEN_PRODUCT_NAMES = ['Bus', 'STB', 'STR'];

const LineIndicator = ({
  className,
  lineName,
  product,
  productName,
}: LineIndicatorProps) => {
  const displayName = !HIDDEN_PRODUCT_NAMES.includes(productName)
    ? lineName
    : lineName.replace(productName, '').trim();

  return (
    <div
      className={clsx(styles.base, inter.className, className)}
      style={{ backgroundColor: `var(--color-${product})` }}
    >
      {displayName || productName}
    </div>
  );
};

export default LineIndicator;
