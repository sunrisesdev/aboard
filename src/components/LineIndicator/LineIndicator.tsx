import { getLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import { inter } from '@/styles/fonts';
import { HAFASProductType } from '@/traewelling-sdk/hafasTypes';
import clsx from 'clsx';
import ThemeProvider from '../ThemeProvider/ThemeProvider';
import styles from './LineIndicator.module.scss';
import { LineIndicatorProps } from './types';

const HIDDEN_PRODUCT_NAMES = ['Bus', 'STB', 'STR'];
const RECTANGULAR_PRODUCTS: HAFASProductType[] = [
  'national',
  'nationalExpress',
  'regional',
  'regionalExp',
];

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
    <ThemeProvider theme={theme}>
      <div
        className={clsx(
          inter.className,
          styles.base,
          isInverted && styles.isInverted,
          RECTANGULAR_PRODUCTS.includes(product) && styles.isRectangular,
          className
        )}
      >
        {displayName || productName}
      </div>
    </ThemeProvider>
  );
};

export default LineIndicator;
