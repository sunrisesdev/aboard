'use client';

import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useOptimistic, useState, useTransition } from 'react';
import { Button } from '@/components/Button/Button';
import type { Extend, Structure } from '@/helpers/extend';
import type { StatusResource } from '@/lib/traewelling';
import { setStatusLikeAction } from '@/status/actions';

export const StatusLikeButton = ({
  showLabel = false,
  status,
  ...props
}: Extend<Structure, { showLabel?: boolean; status: Pick<StatusResource, 'id' | 'liked' | 'likes'> }>) => {
  // Kept locally, because the dashboard doesn't receive updated statuses after a refresh
  const [like, setLike] = useState({ liked: status.liked, likes: status.likes });
  const [optimisticLike, setOptimisticLike] = useOptimistic(like);
  const [isPending, startTransition] = useTransition();
  const { liked, likes } = optimisticLike;

  const toggleLike = () => {
    if (isPending) return;

    startTransition(async () => {
      setOptimisticLike({ liked: !liked, likes: likes + (liked ? -1 : 1) });

      const result = await setStatusLikeAction(status.id, !liked);

      if (result.success) {
        startTransition(() => setLike({ liked: !liked, likes: result.likes }));
      } else {
        window.alert(result.message);
      }
    });
  };

  const icon = liked ? (
    <IconHeartFilled aria-hidden data-via-icon style={{ color: 'var(--via-fg-error)' }} />
  ) : (
    <IconHeart aria-hidden data-via-icon />
  );

  if (!showLabel) {
    return (
      <Button
        aria-label={`Gefällt mir (${likes})`}
        aria-pressed={liked}
        leadingSlot={icon}
        onClick={toggleLike}
        title={liked ? 'Like entfernen' : 'Status liken'}
        variant="secondary"
        {...props}
      >
        {likes}
      </Button>
    );
  }

  return (
    <>
      <Button
        aria-pressed={liked}
        leadingSlot={icon}
        onClick={toggleLike}
        title={liked ? 'Like entfernen' : 'Status liken'}
        variant={liked ? 'secondary' : 'primary'}
        {...props}
      >
        <span>Gefällt {liked ? 'dir' : 'mir'}</span>
      </Button>
      {likes > 0 && <span style={{ fontWeight: 500 }}>{likes}</span>}
    </>
  );
};
