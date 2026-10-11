import {
  IconBriefcase,
  IconBuilding,
  IconEyeOff,
  IconHeartHandshake,
  IconLock,
  IconUser,
  IconUserCheck,
  IconUsers,
  IconWorld,
} from '@tabler/icons-react';
import type { RadioCardsOption } from '@/components/RadioCards/RadioCards';
import type { SegmentedControlOption } from '@/components/SegmentedControl/SegmentedControl';
import type { Business, StatusVisibility } from '@/lib/traewelling';

export const businessOptions: SegmentedControlOption<Business>[] = [
  { icon: <IconUser aria-hidden data-via-icon />, label: 'Privat', value: 0 },
  { icon: <IconBriefcase aria-hidden data-via-icon />, label: 'Geschäftlich', value: 1 },
  { icon: <IconBuilding aria-hidden data-via-icon />, label: 'Arbeitsweg', value: 2 },
];

// Ordered from the widest to the narrowest audience rather than by value.
export const visibilityOptions: RadioCardsOption<StatusVisibility>[] = [
  { description: 'Für alle sichtbar', icon: <IconWorld data-via-icon />, label: 'Öffentlich', value: 0 },
  {
    description: 'Nur über Link sichtbar',
    icon: <IconEyeOff data-via-icon />,
    label: 'Ungelistet',
    value: 1,
  },
  {
    description: 'Nur mit Träwelling-Konto',
    icon: <IconUserCheck data-via-icon />,
    label: 'Angemeldet',
    value: 4,
  },
  { description: 'Nur für deine Follower', icon: <IconUsers data-via-icon />, label: 'Follower', value: 2 },
  {
    description: 'Nur für vertraute Personen',
    icon: <IconHeartHandshake data-via-icon />,
    label: 'Vertraut',
    value: 5,
  },
  { description: 'Nur für dich', icon: <IconLock data-via-icon />, label: 'Privat', value: 3 },
];
