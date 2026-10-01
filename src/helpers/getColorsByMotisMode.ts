import type { MotisMode } from '@/lib/traewelling';

const colorsByMotisMode: Partial<Record<MotisMode, [string, string]>> = {
  AIRPLANE: ['#008984', '#FFF'],
  BUS: ['#6E368C', '#FFF'],
  COACH: ['#DB0078', '#FFF'],
  FERRY: ['#0087B9', '#FFF'],
  HIGHSPEED_RAIL: ['#282D37', '#FFF'],
  LONG_DISTANCE: ['#646973', '#FFF'],
  METRO: ['#1455C0', '#FFF'],
  NIGHT_RAIL: ['#646973', '#FFF'],
  RAIL: ['#646973', '#FFF'],
  REGIONAL_FAST_RAIL: ['#878C96', 'var(--via-neutral-900)'],
  REGIONAL_RAIL: ['#878C96', 'var(--via-neutral-900)'],
  SUBURBAN: ['#408335', '#FFF'],
  SUBWAY: ['#1455C0', '#FFF'],
  TRAM: ['#8C2E46', '#FFF'],
};

export function getColorsByMotisMode(mode: string | undefined) {
  return mode ? colorsByMotisMode[mode.toUpperCase() as keyof typeof colorsByMotisMode] : undefined;
}
