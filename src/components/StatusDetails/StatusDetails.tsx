'use client';

import { useCurrentStatus } from '@/hooks/useCurrentStatus/useCurrentStatus';
import { StatusDetailsProps } from './types';

const StatusDetails = ({ id }: StatusDetailsProps) => {
  const { status } = useCurrentStatus();

  return (
    <div>
      Details für Status: {id} {JSON.stringify(status)}
    </div>
  );
};

export default StatusDetails;
