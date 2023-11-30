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
}: LineIndicatorProps) => {
  const displayName = lineName
    .replaceAll(new RegExp(`^(${HIDDEN_PRODUCT_NAMES.join('|')})`, 'gi'), '')
    .trim();

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
        {displayName}
      </div>
    </ThemeProvider>
  );
};

export default LineIndicator;
