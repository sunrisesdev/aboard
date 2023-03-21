'use client';

import { useStatus } from '@/hooks/useStatus/useStatus';
import { StatusDetailsProps } from './types';

const StatusDetails = ({ id }: StatusDetailsProps) => {
  const { status } = useStatus(id);

  return (
    <div>
      Details für Status: {id} {JSON.stringify(status)}
    </div>
  );
};

export default StatusDetails;
