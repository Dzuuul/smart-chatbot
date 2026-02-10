import { Request } from 'express';
import { UserAdmin } from '../../users/users.service';

export interface RequestWithUser extends Request {
  user: UserAdmin;
}
