import { User } from './user';

export interface RefreshToken {
  id: number;
  userId: string;
  token: string;
  jwtId: string;
  isRevoked: boolean;
  dateAdded: Date;
  dateExpire: Date;

  user?: User;
}
