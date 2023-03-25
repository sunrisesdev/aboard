import { getLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import { inter } from '@/styles/fonts';
import clsx from 'clsx';
import Accent from '../Accent/Accent';
import styles from './LineIndicator.module.scss';
import { LineIndicatorProps } from './types';

const HIDDEN_PRODUCT_NAMES = ['Bus', 'STB', 'STR'];

const LineIndicator = ({
  className,
  isInverted = false,
  lineId,
  lineName,
  product,
  productName,
}: LineIndicatorProps) => {
  const displayName = !HIDDEN_PRODUCT_NAMES.includes(productName)
    ? lineName
    : lineName.replace(productName, '').trim();

  const theme = getLineTheme(lineId, product);

  return (
    <Accent theme={theme}>
      <div
        className={clsx(
          styles.base,
          isInverted && styles.isInverted,
          inter.className,
          className
        )}
      >
        {displayName || productName}
      </div>
    </Accent>
  );
};

export default LineIndicator;
