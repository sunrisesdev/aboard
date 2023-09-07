import * as auth from './functions/auth';
import * as dashboard from './functions/dashboard';
import * as notifications from './functions/notifications';
import * as status from './functions/status';
import * as trains from './functions/trains';
import * as user from './functions/user';

export const TraewellingSdk = {
  auth,
  status,
  trains,
  user,
  dashboard,
  notifications,
};
