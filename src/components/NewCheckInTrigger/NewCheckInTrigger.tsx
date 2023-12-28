'use client';

import { useCreateCheckIn } from '@/hooks/useCreateCheckIn/useCreateCheckIn';

export const NewCheckInTrigger = () => {
  const { content, startOrResume } = useCreateCheckIn();

  return (
    <>
      <button
        onClick={() => startOrResume()}
        style={{ left: '1rem', position: 'absolute', top: '1rem' }}
      >
        Check-In 2.0
      </button>

      {content}
    </>
  );
};
