'use client';

import { IconRestore } from '@tabler/icons-react';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { Input } from '@/components/Input/Input';
import { toDatetimeLocalValue } from '@/helpers/toDatetimeLocalValue';
import { useStationboard } from '@/station/Stationboard/useStationboard';

export const StationboardTimePicker = () => {
  const { changeRequestedTime, requestedTime } = useStationboard();

  return (
    <ButtonGroup>
      <Input
        onChange={(event) =>
          changeRequestedTime(event.target.value ? new Date(event.target.value).toISOString() : undefined)
        }
        style={{ flexShrink: 0, minWidth: 'min-content' }}
        type="datetime-local"
        value={toDatetimeLocalValue(requestedTime ?? new Date().toISOString())}
      />

      <Button
        onClick={() => changeRequestedTime(undefined)}
        style={{ flexGrow: 0, minWidth: 'min-content' }}
        variant="secondary"
      >
        <IconRestore aria-hidden data-via-icon />
        <span>Jetzt</span>
      </Button>
    </ButtonGroup>
  );
};
