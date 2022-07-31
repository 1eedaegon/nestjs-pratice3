import { User } from '../user';

export class IUserRepository {
  findByEmail: (email: string) => Promise<User>;
  save: (
    id: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken,
  ) => Promise<void>;
}
