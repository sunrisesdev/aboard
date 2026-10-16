'use client';

import { IconBriefcase, IconEye, IconMessage } from '@tabler/icons-react';
import { useId } from 'react';
import { CheckInVisibilityDrawer } from '@/checkin/CheckInVisibilityDrawer/CheckInVisibilityDrawer';
import { CharacterCounter } from '@/components/CharacterCounter/CharacterCounter';
import { FieldsetCard } from '@/components/FieldsetCard/FieldsetCard';
import { RadioCards } from '@/components/RadioCards/RadioCards';
import { SegmentedControl } from '@/components/SegmentedControl/SegmentedControl';
import type { Business, StatusVisibility } from '@/lib/traewelling';
import { businessOptions, visibilityOptions } from '@/status/statusOptions';
import styles from './StatusFields.module.css';

const bodyMaxLength = 280;

export type StatusFieldValues = {
  body: string;
  business: Business;
  visibility: StatusVisibility;
};

export const StatusFields = ({
  inDrawer = false,
  onValueChange,
  values,
}: {
  inDrawer?: boolean;
  onValueChange: <Key extends keyof StatusFieldValues>(key: Key, value: StatusFieldValues[Key]) => void;
  values: StatusFieldValues;
}) => {
  const bodyId = useId();
  const businessLabelId = useId();
  const visibilityLabelId = useId();

  return (
    <>
      <FieldsetCard
        icon={<IconMessage data-via-icon />}
        optional
        title={<FieldsetCard.Title htmlFor={bodyId}>Statusnachricht</FieldsetCard.Title>}
      >
        <textarea
          className={styles.textarea}
          id={bodyId}
          maxLength={bodyMaxLength}
          onChange={(event) => onValueChange('body', event.target.value)}
          placeholder="Was gibt's Neues?"
          value={values.body}
        />

        <CharacterCounter className={styles.characterCounter} count={values.body.length} limit={bodyMaxLength} />
      </FieldsetCard>

      <FieldsetCard
        icon={<IconBriefcase data-via-icon />}
        title={<FieldsetCard.Title id={businessLabelId}>Zweck der Fahrt</FieldsetCard.Title>}
      >
        <SegmentedControl<Business>
          aria-labelledby={businessLabelId}
          onValueChange={(business) => onValueChange('business', business)}
          options={businessOptions}
          value={values.business}
        />
      </FieldsetCard>

      {inDrawer ? (
        <div className={styles.drawerPrivacyCard}>
          <CheckInVisibilityDrawer
            onValueChange={(visibility) => onValueChange('visibility', visibility)}
            value={values.visibility}
          />

          <hr className={styles.divider} />
        </div>
      ) : (
        <FieldsetCard
          icon={<IconEye data-via-icon />}
          title={<FieldsetCard.Title id={visibilityLabelId}>Sichtbarkeit</FieldsetCard.Title>}
        >
          <RadioCards<StatusVisibility>
            aria-labelledby={visibilityLabelId}
            columns={2}
            onValueChange={(visibility) => onValueChange('visibility', visibility)}
            options={visibilityOptions}
            value={values.visibility}
          />
        </FieldsetCard>
      )}
    </>
  );
};
