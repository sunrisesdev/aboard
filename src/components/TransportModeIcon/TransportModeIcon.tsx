import Image, { type ImageProps } from 'next/image';
import type { Extend, Structure } from '@/helpers/extend';
import type { MotisMode } from '@/lib/traewelling';

type TransportModeIcon =
  | 'bikesharing'
  | 'bus'
  | 'carsharing'
  | 'coach'
  | 'ferry'
  | 'high-speed'
  | 'long-distance'
  | 'plane'
  | 'regional'
  | 'replacement-bus'
  | 'replacement'
  | 'suburban'
  | 'subway'
  | 'taxi'
  | 'tram';

const iconByMotisMode: Partial<Record<MotisMode, TransportModeIcon>> = {
  HIGHSPEED_RAIL: 'high-speed',
  RAIL: 'long-distance',
  LONG_DISTANCE: 'long-distance',
  NIGHT_RAIL: 'long-distance',
  REGIONAL_RAIL: 'regional',
  REGIONAL_FAST_RAIL: 'regional',
  COACH: 'coach',
  BUS: 'bus',
  SUBURBAN: 'suburban',
  SUBWAY: 'subway',
  METRO: 'subway',
  TRAM: 'tram',
  FERRY: 'ferry',
};

export const TransportModeIcon = ({
  icon,
  height = 20,
  mode,
  width = 20,
  ...props
}: Extend<
  Structure,
  { icon?: TransportModeIcon; height?: ImageProps['height']; mode?: string; width?: ImageProps['width'] }
>) => {
  const iconName = icon ?? (mode && iconByMotisMode[mode?.toUpperCase() as MotisMode]);

  if (!iconName) return null;

  return <Image alt="" height={height} src={`/symbols/${iconName}.svg`} width={width} {...props} />;
};
