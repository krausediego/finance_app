import { Prisma, User } from '@prisma/client';
import { ISignIn } from '../interfaces/auth/sign-in.interface';

export interface UserRepository {
  signUp(data: Prisma.UserCreateInput): Promise<void>;
  signIn(data: Omit<ISignIn, 'password'>): Promise<User>;
  updateLastLogin(user_id: string): Promise<void>;
  getProfile(
    id: string,
  ): Promise<Omit<User, 'password' | 'created_at' | 'updated_at'>>;
  updateProfile(id: string, data: Prisma.UserUpdateInput): Promise<User>;
}
