import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ISignIn } from 'src/domain/interfaces/auth/sign-in.interface';
import { UserRepository } from 'src/domain/repositories/user-repository.interface';

@Injectable()
export class DatabaseUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async signUp(data: Prisma.UserCreateInput): Promise<void> {
    await this.prismaService.user.create({ data });
  }

  async signIn(data: Omit<ISignIn, 'password'>): Promise<User> {
    const { emailOrUsername, id } = data;

    return this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername },
          { id: id },
        ],
      },
    });
  }

  async updateLastLogin(user_id: string): Promise<void> {
    await this.prismaService.user.update({
      data: { last_login: new Date() },
      where: { id: user_id },
    });
  }

  async getProfile(
    id: string,
  ): Promise<Omit<User, 'password' | 'created_at' | 'updated_at'>> {
    return this.prismaService.user.findUnique({
      select: {
        id: true,
        email: true,
        username: true,
        avatar_url: true,
        last_login: true,
        phone: true,
      },
      where: { id },
    });
  }

  async updateProfile(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prismaService.user.update({ data, where: { id } });
  }
}
