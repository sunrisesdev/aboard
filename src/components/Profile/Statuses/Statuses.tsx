'use client';

import { useUserStatuses } from '@/hooks/useUserStatuses/useUserStatus';

const Statuses = ({ username }: { username: string }) => {
  const { isLoading, statuses } = useUserStatuses(username);

  if (isLoading) return <div>Loading {username} Statuses...</div>;

  return (
    <div>
      {statuses?.map(
        ({ id, user, body, likes, liked, checkin }) => {
          return (
            <div key={id}>
              <div>{user.username}</div>
              <div>{checkin.lineName}</div>
              <div>{body}</div>
              <div>{likes}</div>
              <div>{liked && '❤️'}</div>
              <div>{id}</div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default Statuses;
