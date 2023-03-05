import { inter } from '@/styles/fonts';
import classNames from 'classnames';
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
      className={classNames(styles.base, inter.className, className)}
      style={{ backgroundColor: `var(--color-${product})` }}
    >
      {displayName || productName}
    </div>
  );
};

export default LineIndicator;
